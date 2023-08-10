import RequestPromise from "../Request/Request";
import SteamAccountInterface from "../../interfaces/SteamAccount/SteamAccountInterface";
import SteamAccountSetupInterface from "../../interfaces/SteamAccount/SteamAccountSetupInterface";
import SteamAccountStorage from "../newStorage/SteamAccountStorage";
import { v4 as uuidv4 } from 'uuid';
import SmaFile from "../../interfaces/SteamAccount/SmaFileInterface";
import ChangableSecondaryInterface from "../../interfaces/SteamAccount/ChangableSecondaryInterface";
import steamAccountManager from "./steamAccountManager";
import SteamCommunity from "steamcommunity";
import Session from "../../interfaces/SteamAccount/SessionInterface";
import { getSecondaries, getChangableSecondaries } from './Processes/loadSteamAccountData';
import CConfirmation from "steamcommunity/classes/CConfirmation";
import SecondaryInterface from "../../interfaces/SteamAccount/SecondaryInterface";
import ProxyInterface from "../../interfaces/Proxy/ProxyInterface";
import request from "request";
import Manager from "../manager/manager";
import askFamilyPin from "../application/askInfo/askFamilyPin";
import Chrome from './Chrome/Chrome';
import { EAuthSessionGuardType, EAuthTokenPlatformType, LoginSession } from "steam-session";
import maFileLogin from "./Processes/maFileLogin";
import askMailCode from "../application/askInfo/askMailCode";
import SessionInterface from "../../interfaces/SteamAccount/SessionInterface";
const SteamTotp = require('steam-totp');

class SteamAccount {
    params: SteamAccountInterface;
    setupParams: SteamAccountSetupInterface;
    community: SteamCommunity;
    isAskingFamilyPin: boolean;
    chrome: Chrome;
    session: LoginSession;
    proxy: ProxyInterface | null;

    constructor(params: SteamAccountInterface) {
        this.setupParams = {
            accountName: params.accountName,
            password: params.password,
            maFile: params.maFile,
            familyViewPin: params.familyViewPin,
            useSteamCookies: params.useSteamCookies
        };
        this.chrome = new Chrome(params);
        this.params = params;
        this.community = new SteamCommunity();
        this.session = new LoginSession(EAuthTokenPlatformType.MobileApp);

        this.isAskingFamilyPin = false;
        const links = Manager.GetSteamAccountLinkedData(this.params.id);
        this.proxy = null;
        if (links.proxy) {
            this.proxy = links.proxy;
            this.setProxy(links.proxy)
        }
    }


    async initSession() {
        return new Promise(async (resolve, reject) => {
            try {
                if (this.params.maFile.Session && this.params.maFile.Session.AccessToken && this.params.maFile.Session.RefreshToken) {
                    this.session.accessToken = this.params.maFile.Session.AccessToken;
                    this.session.refreshToken = this.params.maFile.Session.RefreshToken;
                    await this.session.refreshAccessToken();
                    const cookies = await this.session.getWebCookies();
                    console.log(`${this.params.id} - cookies loaded`);
                    this.community.setCookies(cookies);
                    resolve(undefined);
                }

            } catch (err) {
                console.log(err);
            }
        });
    }

    setProxy(proxy: ProxyInterface | null) {
        try {
            this.proxy = proxy;
            if (proxy) {
                this.session = new LoginSession(EAuthTokenPlatformType.MobileApp, {
                    httpProxy: `http://${proxy.username}:${proxy.password}@${proxy.host}:${proxy.port}`
                });
                const proxyRequest = request.defaults({ proxy: `http://${proxy.username}:${proxy.password}@${proxy.host}:${proxy.port}` });
                this.community = new SteamCommunity({ request: proxyRequest });
            }
        } catch (err) {
            throw new Error(`Error in setProxy: ${err}`);
        }
    }

    loginByPassword(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const result = await this.session.startWithCredentials({
                accountName: this.params.accountName,
                password: this.params.password,
                steamGuardCode: SteamTotp.generateAuthCode(this.params.maFile.shared_secret)
            });

            if (result.actionRequired && result.validActions) {
                if (result.validActions.map(el => el.type).includes(EAuthSessionGuardType.EmailCode)) {
                    const code = await askMailCode(this.params.accountName, this.params.accountName);
                    await this.session.submitSteamGuardCode(code);
                }
            }

            this.session.on("error", (err) => {
                reject(err);
            });
            this.session.on("timeout", () => {
                reject("timeout");
            });
            this.session.on("authenticated", async () => {
                const accessToken = this.session.accessToken;
                const refreshToken = this.session.refreshToken;
                const steamID = this.session.steamID;
                const cookies = await this.session.getWebCookies();
                console.log(cookies);
                this.community.setCookies(cookies);
                //const oldSession = convertCookiesToSession(cookies);
                const newSession: SessionInterface = {
                    AccessToken: accessToken,
                    RefreshToken: refreshToken,
                    SteamID: steamID.toString(),
                    SessionID: ""
                }
                console.log(newSession);
                this.saveSession(newSession);
                resolve();
            });
        });
    }
    isLogin(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.community.loggedIn(async (err, loggedIn, familyView) => {
                //console.log(`#${this.params.number} err: ${err}, loggedIn: ${loggedIn}, familyView: ${familyView}`);
                if (err) return reject(err);
                if (loggedIn) {
                    if (familyView) {
                        try {
                            if (this.params.familyViewPin) {
                                await this.setPin(this.params.familyViewPin)
                                    .then(() => {
                                        resolve(true);
                                    })
                                    .catch(async err => {
                                        try {
                                            const pin = await askFamilyPin(this.params.id, this.params.accountName);
                                            await this.setPin(pin);
                                            resolve(true);
                                        } catch (err) {
                                            reject(`famliy pin is not applied: ${err}`);
                                        }
                                    });
                            } else {
                                try {
                                    const pin = await askFamilyPin(this.params.id, this.params.accountName);
                                    await this.setPin(pin);
                                    resolve(true);
                                } catch (err) {
                                    reject(`famliy pin is not applied: ${err}`);
                                }
                            }
                        } catch (err) {
                            reject(`famliy pin is not applied: ${err}`);
                        }
                    } else {
                        resolve(true);
                    }
                } else {
                    resolve(false);
                }
            });
        });
    }
    getSecondary(): Promise<SecondaryInterface> {
        return new Promise((resolve, reject) => {
            getSecondaries(this.community)
                .then((data) => {
                    try {
                        this.editParams({ secondary: data });
                        resolve(data);
                    } catch (err) {
                        reject(err);
                    }
                })
                .catch(err => {
                    reject(err);
                });
        });
    }
    getChangableSecondary(): Promise<ChangableSecondaryInterface> {
        return new Promise((resolve, reject) => {
            getChangableSecondaries(this.community, this.params.tmApiKey ? this.params.tmApiKey : "")
                .then(data => {
                    try {
                        // console.log(`#${this.params.number} successful get changable secondary!`);
                        this.editParams({ changableSecondary: data });
                        resolve(data);
                    } catch (err) {
                        reject(err);
                    }
                })
                .catch(err => {
                    //console.log(`#${this.params.number} UNSUCCESSFUL get changable secondary (${err})`);
                    reject(err);
                });
        });
    }
    setPin(pin: number): Promise<void> {
        return new Promise(async (resolve, reject) => {
            this.community.parentalUnlock(pin, (err) => {
                if (err) return reject('pin incorrect');

                try {
                    //console.log(`successful set pin: ${pin} (#${this.params.number})`);
                    this.editParams({ familyViewPin: Number(pin) });
                } catch (err) {
                    reject(err);
                }
            });
        });
    }
    getSmaFile() {
        const smaFile: SmaFile = {
            secondary: this.params.secondary,
            accountName: this.params.accountName,
            password: this.params.password,
            maFile: this.params.maFile,
            familyViewPin: this.params.familyViewPin,
            useSteamCookies: this.params.useSteamCookies
        }
        return smaFile;
    }
    async saveSession(session: Session) {
        try {
            this.params.maFile.Session = session;
            console.log(this.params.maFile);
            this.editParams({ maFile: this.params.maFile });
        } catch (err) {
            throw new Error(`Не удалось сохранить сессию: ${err}`);
        }
    }
    getConfirmations(): Promise<CConfirmation[]> {
        return new Promise((resolve, reject) => {
            const time = Number((Number(new Date()) / 1000).toFixed(0));
            const key = SteamTotp.generateConfirmationKey(this.params.maFile.identity_secret, time, "conf");
            this.community.getConfirmations(time, key, (err, confirmations) => {
                if (err) return reject(err);
                resolve(confirmations);
            });
        });
    }
    confirmItems(ids: number[], keys: string[]): Promise<void> {
        return new Promise((resolve, reject) => {
            const time = Math.floor(Number(new Date()) / 1000);
            const key = SteamTotp.getConfirmationKey(this.params.maFile.identity_secret, time, 'allow');
            this.community.respondToConfirmation(ids, keys, time, key, true, (err) => {
                if (err) return reject(err);
                resolve();
            });
        });
    }
    cancelItems(ids: number[], keys: string[]): Promise<void> {
        return new Promise((resolve, reject) => {
            const time = Math.floor(Number(new Date()) / 1000);
            const key = SteamTotp.getConfirmationKey(this.params.maFile.identity_secret, time, 'cancel');
            this.community.respondToConfirmation(ids, keys, time, key, false, (err) => {
                if (err) return reject(err);
                resolve();
            });
        });
    }
    editParams(newParams: { [K in keyof SteamAccountInterface]?: SteamAccountInterface[K] }) {
        for (var i in this.params) {
            if (typeof (newParams[i]) !== 'undefined') {
                this.params[i] = newParams[i];
            }
        }
        SteamAccountStorage.EditData(this.params.id, newParams);
    }
    static Generate(smaFile: SmaFile, changableSecondary: ChangableSecondaryInterface | null) {
        const steamAccounts = steamAccountManager.objects;
        steamAccounts.sort((a, b) => a.params.number < b.params.number ? 1 : -1);

        const maxNumber = steamAccounts.length === 0 ? 1 : steamAccounts[0].params.number + 1;
        //console.log(`max number: ${maxNumber}`);

        const params: SteamAccountInterface = {
            id: uuidv4(),
            number: maxNumber,
            ...smaFile,
            changableSecondary: changableSecondary ? changableSecondary : {
                steam: {
                    balance: 0,
                    currency: 'RUB',
                    error: null
                },
                market: {
                    balance: 0,
                    currency: 'RUB',
                    error: null
                },

            },
            deleted: false
        }

        return params;
    }
}

export default SteamAccount;