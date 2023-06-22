const SteamTotp = require('steam-totp');
import { ipcMain } from "electron";
import SessionInterface from '../../../interfaces/SteamAccount/SessionInterface';
import SteamCommunity from "steamcommunity";
import MaFileInterface from "../../../interfaces/SteamAccount/MaFileInterface";
import SmaFileInterface from "../../../interfaces/SteamAccount/SmaFileInterface";
import SteamAccountSetupInterface from "../../../interfaces/SteamAccount/SteamAccountSetupInterface";
import application from "../../application/application";

import convertCookiesToSession from "../../Functions/convertCookiesToSession";
import convertSessionToCookies from "../../Functions/convertSessionToCookies";
import SuperMethods from "../../SuperMethods/SuperMethods";
import { getSecondaries } from "./loadSteamAccountData";
import SteamAccountChannels from '../../../interfaces/IpcChannels/SteamAccountChannels';
import CreationStepType from '../../../interfaces/SteamAccount/CreationStepType';
import ProxySetupInterface from "../../../interfaces/Proxy/ProxySetupInterface";
import request from "request";
import askFamilyPin from "../../application/askInfo/askFamilyPin";

type AbortChannelType = SteamAccountChannels.STEAM_ACCOUNT_CREATE_PROCESS_ABORT | SteamAccountChannels.GUARD_SETUP_PROCESS_ABORT;
type StepType = SteamAccountChannels.STEAM_ACCOUNT_CREATE_PROCESS_STEP | SteamAccountChannels.GUARD_SETUP_PROCESS_STEP;

export default async function maFileLogin(steamAccountParams: SteamAccountSetupInterface, options?: { abortChannel?: AbortChannelType, stepChannel?: StepType }, proxy?: ProxySetupInterface): Promise<SmaFileInterface> {
    return new Promise<SmaFileInterface>(async (resolve, reject) => {
        var community = new SteamCommunity();
        if (proxy) {
            const proxyRequest = request.defaults({ proxy: `http://${proxy.username}:${proxy.password}@${proxy.host}:${proxy.port}` });
            community = new SteamCommunity({ request: proxyRequest });
        }

        const nextStep = (step: CreationStepType) => options && options.stepChannel ? application.sendToMain(options.stepChannel, step) : () => { };
        if (options && options.abortChannel)
            ipcMain.on(options.abortChannel, () => {
                reject('abort');
            });

        const checkSession = (accountId: string, maFile: MaFileInterface): Promise<void> => {
            return new Promise<void>((resolve, reject) => {
                nextStep("checkLoginStatus");
                if (maFile.Session?.SteamLoginSecure &&
                    maFile.Session.SessionID &&
                    maFile.Session.WebCookie &&
                    maFile.Session.SteamID
                ) {
                    const cookies = convertSessionToCookies(maFile.Session);
                    console.log('revert: ');
                    console.log(cookies);
                    community.setCookies(cookies);
                    community.loggedIn(async (err, loggedIn, familyView) => {
                        console.log('logged in:');
                        console.log(err, loggedIn, familyView);
                        if (err) return reject(err);
                        if (!loggedIn) return reject(new Error("Not logged in"));
                        if (familyView) {
                            await familyViewPinLoop(accountId, maFile.account_name)
                                .catch((err) => {
                                    return reject(err);
                                })
                        }
                        console.log(err, loggedIn, familyView);
                        resolve();
                    });
                } else {
                    reject(new Error("Invalid session"));
                }
            });
        }

        const createSession = (accountName: string, password: string, shared_secret: string): Promise<SessionInterface> => {
            return new Promise<SessionInterface>((resolve, reject) => {
                nextStep("loginByPassword");
                community.login({
                    accountName: accountName,
                    password: password,
                    twoFactorCode: SteamTotp.generateAuthCode(shared_secret),
                    disableMobile: true
                }, async (err, _sessionID, _cookies, _steamguard, oAuthToken) => {
                    if (err) {
                        if (err.message == "SteamGuardMobile") {
                            await SuperMethods.Sleep(7000);
                            resolve(await createSession(accountName, password, shared_secret));
                        }

                        return reject(err);
                    }
                    console.log(_cookies);
                    const session: SessionInterface = convertCookiesToSession(_cookies);
                    resolve(session);
                });
            });
        }

        const familyViewPinLoop = (accountId: string, accountName: string): Promise<void> => {
            return new Promise<void>((resolve, reject) => {
                nextStep("askPin");
                askFamilyPin(accountId, accountName)
                    .then((pin) => {
                        console.log(pin);
                        tryFamilyViewPin(pin)
                            .then(() => {
                                steamAccountParams.familyViewPin = pin;
                                resolve();
                            })
                            .catch((err) => {
                                if (err.message == "Incorrect PIN") {
                                    application.sendToMain('ERROR', 'Неправильный пин');
                                } else {
                                    reject(err);
                                }
                            });
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        }

        const tryFamilyViewPin = (pin: number): Promise<void> => {
            return new Promise<void>((resolve, reject) => {
                nextStep("tryPin");
                community.parentalUnlock(pin, (err) => {
                    if (err) return reject(err);
                    resolve();
                });
            });
        }

        checkSession(steamAccountParams.maFile.Session.SteamID, steamAccountParams.maFile)
            .then(() => {
                nextStep("loadData");
                getSecondaries(community)
                    .then(data => {
                        const sMaFile: SmaFileInterface = {
                            accountName: steamAccountParams.accountName,
                            password: steamAccountParams.password,
                            maFile: steamAccountParams.maFile,
                            secondary: data,
                            tmApiKey: steamAccountParams.tmApiKey ? steamAccountParams.tmApiKey : undefined,
                            familyViewPin: steamAccountParams.familyViewPin ? steamAccountParams.familyViewPin : null,
                            useSteamCookies: steamAccountParams.useSteamCookies
                        };
                        resolve(sMaFile);
                    })
                    .catch(err => {
                        reject(err);
                    });
            })
            .catch(async (err) => {
                if (err.message == "Invalid session" || err.message == "Not logged in") {
                    console.log("Create session")
                    createSession(steamAccountParams.accountName, steamAccountParams.password, steamAccountParams.maFile.shared_secret)
                        .then(session => {
                            steamAccountParams.maFile.Session = session;
                            console.log(session);
                            maFileLogin(steamAccountParams, options)
                                .then(smaFile => {
                                    resolve(smaFile);
                                })
                                .catch((err) => {
                                    reject(err);
                                });
                        })
                        .catch(err => {
                            reject(err);
                        });
                } else {
                    reject(err);
                }
            });
    });
}