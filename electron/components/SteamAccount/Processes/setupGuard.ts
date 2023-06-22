const SteamTotp = require('steam-totp');
import { ipcMain } from "electron";
import SessionInterface from "../../../interfaces/SteamAccount/SessionInterface";
import SteamCommunity from "steamcommunity";
import CreationStepType from "../../../interfaces/SteamAccount/CreationStepType";
import MaFileInterface from "../../../interfaces/SteamAccount/MaFileInterface";
import SmaFileInterface from "../../../interfaces/SteamAccount/SmaFileInterface";
import application from "../../application/application";
import askSmsCode from "../../application/askInfo/askSmsCode";
import askMailCode from "../../application/askInfo/askMailCode";
import convertCookiesToSession from "../../Functions/convertCookiesToSession";
import { getSecondaries } from "./loadSteamAccountData";
import { v4 as uuidv4 } from 'uuid';
import TwoFactorResponseInterface from '../../../interfaces/SteamAccount/TwoFactorResponseInterface';
import ProxySetupInterface from "../../../interfaces/Proxy/ProxySetupInterface";
import request from "request";

export default async function setupGuard(steamAccountParams: { accountName: string, password: string, tmApiKey?: string }, proxy?: ProxySetupInterface): Promise<SmaFileInterface> {
    return new Promise<SmaFileInterface>(async (resolve, reject) => {
        var community = new SteamCommunity();
        if (proxy) {
            const proxyRequest = request.defaults({ proxy: `http://${proxy.username}:${proxy.password}@${proxy.host}:${proxy.port}` });
            community = new SteamCommunity({ request: proxyRequest });
        }
        const EResult = SteamCommunity.EResult;

        ipcMain.on("ABORT_SETUP_GUARD", () => {
            reject('abort');
        });

        const nextStep = (step: CreationStepType) => {
            application.sendToMain("GUARD_SETUP_STEP", step);
        }

        const doLogin = (accountName: string, password: string, authCode?: string): Promise<MaFileInterface> => {
            return new Promise<MaFileInterface>((resolve, reject) => {
                nextStep("loginByPassword");
                community.login({
                    accountName: accountName,
                    password: password,
                    authCode: authCode,
                    disableMobile: true
                }, async (err, _sessionID, cookies, _steamguard, oAuthToken) => {
                    if (err) {
                        if (err.message == "SteamGuardMobile") {
                            return reject(new Error("This account already has two-factor authentication enabled."));
                        }
                        if (err.message == 'SteamGuard') {
                            console.log(`An email has been sent to your address at ${err.emaildomain}`);
                            nextStep("askEmailCode");
                            const code = await askMailCode(uuidv4(), steamAccountParams.accountName);
                            nextStep("tryEmailCode");
                            resolve(await doLogin(accountName, password, code));
                        }
                        return reject(err);
                    }
                    const session: SessionInterface = convertCookiesToSession(cookies, oAuthToken);
                    community.enableTwoFactor(async (err, response) => {
                        nextStep("enableTwoFactor");
                        if (err) {
                            if (err.eresult == EResult.Fail) {
                                return reject(new Error("Failed to enable two-factor authentication. Perhaps the phone number is not attached."));
                            }
                            if (err.eresult == EResult.RateLimitExceeded) {
                                return reject(new Error("RateLimitExceeded. Try again later."))
                            }
                            return reject(err);
                        }
                        if (response.status != EResult.OK) {
                            return reject(new Error(`Status ${response.status}`))
                        }

                        const rawMaFile: TwoFactorResponseInterface = response;
                        await promptActivationCode(rawMaFile);
                        const maFile: MaFileInterface = createMaFile(rawMaFile, session);
                        resolve(maFile);
                    });
                });
            });
        }

        const createMaFile = (rawMaFile: TwoFactorResponseInterface, session: SessionInterface): MaFileInterface => {
            const steamID = session.SteamID;
            const deviceID = SteamTotp.getDeviceID(steamID);
            const maFile: MaFileInterface = {
                shared_secret: rawMaFile.shared_secret,
                serial_number: rawMaFile.serial_number,
                revocation_code: rawMaFile.revocation_code,
                uri: rawMaFile.uri,
                server_time: rawMaFile.server_time,
                account_name: rawMaFile.account_name,
                token_gid: rawMaFile.token_gid,
                identity_secret: rawMaFile.identity_secret,
                secret_1: rawMaFile.secret_1,
                status: rawMaFile.status,
                device_id: deviceID,
                fully_enrolled: true,
                Session: session
            };
            return maFile;
        }

        const promptActivationCode = (rawMaFile: TwoFactorResponseInterface): Promise<void> => {
            return new Promise<void>(async (resolve, reject) => {
                nextStep("askSmsCode");
                askSmsCode(uuidv4(), steamAccountParams.accountName)
                    .then((smsCode) => {
                        nextStep("trySmsCode");
                        console.log('try sms: ' + smsCode)
                        community.finalizeTwoFactor(rawMaFile.shared_secret, smsCode, async (err) => {
                            if (err) {
                                if (err.message == "Invalid activation code") {
                                    console.log(err);
                                    resolve(await promptActivationCode(rawMaFile));
                                }
                                return reject(err);
                            }
                            nextStep("finalizeTwoFactor");
                            resolve();
                        });
                    })
                    .catch(async (err) => {
                        console.log(err);
                        resolve(await promptActivationCode(rawMaFile));
                    });
            });
        }

        doLogin(steamAccountParams.accountName, steamAccountParams.password)
            .then((maFile) => {
                nextStep("loadData");
                getSecondaries(community)
                    .then(secondaries => {
                        const sMaFile: SmaFileInterface = {
                            accountName: steamAccountParams.accountName,
                            password: steamAccountParams.password,
                            tmApiKey: steamAccountParams.tmApiKey,
                            maFile: maFile,
                            secondary: secondaries,
                            familyViewPin: null
                        };
                        resolve(sMaFile);
                    })
                    .catch(err => {
                        reject(err);
                    })
            })
            .catch(err => {
                reject(err)
            });
    })
}