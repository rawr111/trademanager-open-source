const SteamTotp = require('steam-totp');
import { ipcMain } from "electron";
import SessionInterface from '../../../interfaces/SteamAccount/SessionInterface';
import SteamCommunity from "steamcommunity";
import MaFileInterface from "../../../interfaces/SteamAccount/MaFileInterface";
import SmaFileInterface from "../../../interfaces/SteamAccount/SmaFileInterface";
import SteamAccountSetupInterface from "../../../interfaces/SteamAccount/SteamAccountSetupInterface";
import application from "../../application/application";

import SuperMethods from "../../SuperMethods/SuperMethods";
import { getSecondaries } from "./loadSteamAccountData";
import SteamAccountChannels from '../../../interfaces/IpcChannels/SteamAccountChannels';
import CreationStepType from '../../../interfaces/SteamAccount/CreationStepType';
import ProxySetupInterface from "../../../interfaces/Proxy/ProxySetupInterface";
import request from "request";
import askFamilyPin from "../../application/askInfo/askFamilyPin";
import { EAuthSessionGuardType, EAuthTokenPlatformType, LoginSession } from "steam-session";
import askMailCode from "../../application/askInfo/askMailCode";

type AbortChannelType = SteamAccountChannels.STEAM_ACCOUNT_CREATE_PROCESS_ABORT | SteamAccountChannels.GUARD_SETUP_PROCESS_ABORT;
type StepType = SteamAccountChannels.STEAM_ACCOUNT_CREATE_PROCESS_STEP | SteamAccountChannels.GUARD_SETUP_PROCESS_STEP;

export default async function maFileLogin(steamAccountParams: SteamAccountSetupInterface, options?: { abortChannel?: AbortChannelType, stepChannel?: StepType }, proxy?: ProxySetupInterface): Promise<SmaFileInterface> {
    return new Promise<SmaFileInterface>(async (resolve, reject) => {
        const session = new LoginSession(EAuthTokenPlatformType.MobileApp, {
            httpProxy: proxy ? `http://${proxy.username}:${proxy.password}@${proxy.host}:${proxy.port}` : undefined
        });
        const community = new SteamCommunity({ request: proxy ? request.defaults({ proxy: `http://${proxy.username}:${proxy.password}@${proxy.host}:${proxy.port}` }) : undefined });

        const nextStep = (step: CreationStepType) => options && options.stepChannel ? application.sendToMain(options.stepChannel, step) : () => { };
        if (options && options.abortChannel)
            ipcMain.on(options.abortChannel, () => {
                reject('abort');
            });

        const checkSession = (accountId: string, maFile: MaFileInterface): Promise<void> => {
            return new Promise<void>(async (resolve, reject) => {
                try {
                    nextStep("checkLoginStatus");
                    if (
                        maFile.Session &&
                        maFile.Session?.AccessToken &&
                        maFile.Session.RefreshToken
                    ) {
                        try {
                            session.accessToken = maFile.Session.AccessToken;
                            session.refreshToken = maFile.Session.RefreshToken;
                            await session.refreshAccessToken();
                            const cookies = await session.getWebCookies();
                            community.setCookies(cookies);
                            community.loggedIn(async (err, loggedIn, familyView) => {
                                if (err) return reject(err);
                                if (!loggedIn) return reject(new Error("Not logged in"));
                                if (familyView) {
                                    await familyViewPinLoop(accountId, maFile.account_name)
                                        .catch((err) => {
                                            return reject(err);
                                        })
                                }
                                resolve();
                            });
                        } catch (err) {
                            reject(err);
                        }
                    } else {
                        reject(new Error("Invalid session"));
                    }
                } catch (err) {
                    reject(err);
                }
            });
        }

        const createSession = (accountName: string, password: string, shared_secret: string): Promise<SessionInterface> => {
            return new Promise<SessionInterface>(async (resolve, reject) => {
                try {
                    nextStep("loginByPassword");
                    const result = await session.startWithCredentials({
                        accountName: accountName,
                        password: password,
                        steamGuardCode: SteamTotp.generateAuthCode(shared_secret)
                    });

                    if (result.actionRequired && result.validActions) {
                        if (result.validActions.map(el => el.type).includes(EAuthSessionGuardType.EmailCode)) {
                            const code = await askMailCode(accountName, accountName);
                            await session.submitSteamGuardCode(code);
                        }
                    }

                    session.on("error", (err) => {
                        reject(err);
                    });
                    session.on("timeout", () => {
                        reject("timeout");
                    });
                    session.on("authenticated", async () => {
                        const accessToken = session.accessToken;
                        const refreshToken = session.refreshToken;
                        const steamID = session.steamID;
                        const cookies = await session.getWebCookies();
                        console.log(cookies);
                        //const oldSession = convertCookiesToSession(cookies);
                        const newSession: SessionInterface = {
                            AccessToken: accessToken,
                            RefreshToken: refreshToken,
                            SteamID: steamID.toString(),
                            SessionID: ""
                        }
                        resolve(newSession);
                    });
                } catch (err) {
                    reject(err);
                }
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

        try {
            checkSession(steamAccountParams.accountName, steamAccountParams.maFile)
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
        } catch (err) {
            reject(err);
        }

    });
}