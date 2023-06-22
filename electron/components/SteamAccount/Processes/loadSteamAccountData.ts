import SteamCommunity from "steamcommunity";
import { Response } from "request";
import SecondaryInterface from "../../../interfaces/SteamAccount/SecondaryInterface";
import ChangableSecondaryInterface from "../../../interfaces/SteamAccount/ChangableSecondaryInterface";

export async function getSecondaries(community: SteamCommunity): Promise<SecondaryInterface> {
    return new Promise<SecondaryInterface>(async (resolve, reject) => {
        try {
            const accountData: SecondaryInterface = {
                nickname: await getUsername(community),
                level: await getLevel(community),
                avatarUrl: await getAvatarURL(community),
                ktState: await getKtState(community),
                tpState: await getTpState(community),
                tradeState: await getTradeState(community)
            };
            resolve(accountData);
        } catch (err) {
            return reject(err);
        }
    });
}

function getUsername(community: SteamCommunity): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        try {
            community.httpRequestGet({
                uri: `https://steamcommunity.com/profiles/${community.steamID}/`
            }, (err: SteamCommunity.CallbackError, response: Response, body: Response["body"]) => {
                if (err) return reject(err);
                if (response.statusCode == 200) {
                    if (body.includes("data-miniprofile")) {
                        const username = body.split("data-miniprofile")[1].split(">")[1].split("<")[0];
                        resolve(username);
                    } else {
                        resolve("");
                    }
                } else {
                    reject(new Error(`${response.statusCode}: ${response.statusMessage}`));
                }
            });
        } catch (err) {
            return reject(err);
        }
    });
}

function getAvatarURL(community: SteamCommunity): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        try {
            community.httpRequestGet({
                uri: `https://steamcommunity.com/profiles/${community.steamID}/`
            }, (err: SteamCommunity.CallbackError, response: Response, body: Response["body"]) => {
                if (err) return reject(err);
                if (response.statusCode == 200) {
                    if (body.includes("user_avatar playerAvatar offline")) {
                        const avatarUrl = body.split('user_avatar playerAvatar offline">')[1].split('"')[1].split(">")[0];
                        resolve(avatarUrl);
                    } else {
                        resolve("https://avatars.akamai.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg");
                    }
                } else {
                    reject(new Error(`${response.statusCode}: ${response.statusMessage}`));
                }
            });
        } catch (err) {
            return reject(err);
        }
    });
}

export async function getChangableSecondaries(community: SteamCommunity, marketApiKey: string): Promise<ChangableSecondaryInterface> {
    const promises = [getSteamBalance(community), getMarketBalance(marketApiKey, community)]
    const result = await Promise.allSettled(promises);
    const changableSecondary: ChangableSecondaryInterface = {
        market: {
            error: result[1].status === 'rejected' ? result[1].reason : null,
            balance: result[1].status === 'fulfilled' ? result[1].value.balance : null,
            currency: result[1].status === 'fulfilled' ? result[1].value.currency : null
        },
        steam: {
            error: result[0].status === 'rejected' ? result[0].reason : null,
            balance: result[0].status === 'fulfilled' ? result[0].value.balance : null,
            currency: result[0].status === 'fulfilled' ? result[0].value.currency : null
        }
    }
    return changableSecondary;
}

async function getLevel(community: SteamCommunity): Promise<number> {
    return new Promise<number>((resolve, reject) => {
        community.httpRequestGet({
            uri: `https://steamcommunity.com/profiles/${community.steamID}/`
        }, (err: SteamCommunity.CallbackError, response: Response, body: Response["body"]) => {
            if (err) return reject(err);
            if (response.statusCode == 200) {
                if (body.includes('class="friendPlayerLevelNum"')) {
                    const level: number = Number(body.split('class="friendPlayerLevelNum">')[1].split("</span>")[0]);
                    resolve(level);
                } else {
                    resolve(0);
                }
            } else {
                reject(new Error(`${response.statusCode}: ${response.statusMessage}`));
            }
        });
    });
}

async function getSteamBalance(community: SteamCommunity): Promise<{ balance: number, currency: string }> {
    return new Promise<{ balance: number, currency: string }>((resolve, reject) => {
        community.httpRequestGet({
            uri: "https://store.steampowered.com/account/"
        }, (err: SteamCommunity.CallbackError, response: Response, body: Response["body"]) => {
            if (err) return reject(err);
            if (response.statusCode == 200) {
                try {
                    if (body.includes('id="header_wallet_balance"'))
                        var balanceInfo: string = body.split('<a class="global_action_link" id="header_wallet_balance" href="https://store.steampowered.com/account/store_transactions/">')[1].split("</a>")[0];
                    else
                        if (body.includes('<div class="accountData price">'))
                            var balanceInfo: string = body.split('<div class="accountData price">')[1].split("</div>")[0];
                        else
                            return reject(Error("Не удалось получить баланс"));
                    const balance: number = formatBalance(balanceInfo);
                    const currency: string = formatCurrency(balanceInfo);
                    resolve({ balance: balance, currency: currency });
                } catch (err) {
                    reject(err);
                }
            } else {
                reject(new Error(`${response.statusCode}: ${response.statusMessage}`));
            }
        });
    });
}

async function getMarketBalance(marketApiKey: string, community: SteamCommunity): Promise<{ balance: number, currency: string }> {
    return new Promise<{ balance: number, currency: string }>((resolve, reject) => {
        if (!marketApiKey) {
            return reject('Апи ключ маркета не установлен');
        }
        community.httpRequestGet({
            uri: `https://market.csgo.com/api/v2/get-money?key=${marketApiKey}`
        }, (err: SteamCommunity.CallbackError, response: Response, body: Response["body"]) => {
            if (err) return reject(err);
            if (response.statusCode == 200) {
                const balance = JSON.parse(body);
                resolve({ balance: balance.money, currency: balance.currency });
            } else {
                reject(new Error(`${response.statusCode}: ${response.statusMessage}`));
            }
        });
    });
}

function formatCurrency(balanceInfo: string): string {
    var rawCurrency = balanceInfo.replace(/\d+,+\d+|\d+\.+\d+|\d+/, "");
    switch (rawCurrency) {
        case " pуб.":
            return "₽";
        case "$ USD":
            return "$";
        default:
            return rawCurrency;
    }
}

function formatBalance(balanceInfo: string): number {
    var rawBalance = /\d+,+\d+|\d+\.+\d+|\d+/.exec(balanceInfo);
    if (rawBalance)
        return parseFloat(rawBalance[0].replace(",", "."));
    throw new Error("Не получилось отформатировать");
}

async function getKtState(community: SteamCommunity): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        community.httpRequestGet({
            uri: "https://steamcommunity.com/market/"
        }, (err: SteamCommunity.CallbackError, response: Response, body: Response["body"]) => {
            if (err) return reject(err);
            if (response.statusCode == 200) {
                if (body.includes("Your account is currently locked")) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            } else {
                reject(new Error(`${response.statusCode}: ${response.statusMessage}`));
            }
        });
    });
}

async function getTpState(community: SteamCommunity): Promise<boolean | string> {
    return new Promise<boolean | string>((resolve, reject) => {
        community.httpRequestGet({
            uri: "https://steamcommunity.com/market/"
        }, (err: SteamCommunity.CallbackError, response: Response, body: Response["body"]) => {
            if (err) return reject(err);
            if (response.statusCode == 200) {
                if (body.includes("market_warning_header")) {
                    if (body.includes("market_timecanuse_header")) {
                        const date = body.split('market_timecanuse_header">')[1].split("</span>")[0];
                        resolve(date);
                    }
                    resolve(false);
                } else {
                    resolve(true);
                }
            } else {
                reject(new Error(`${response.statusCode}: ${response.statusMessage}`));
            }
        });
    });
}

async function getTradeState(community: SteamCommunity): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        community.httpRequestGet({
            uri: "https://steamcommunity.com/tradeoffer/new/?partner=1019092302&token=1hP4HPB2"
        }, (err: SteamCommunity.CallbackError, response: Response, _body: Response["body"]) => {
            if (err) {
                if (err.message.includes("You cannot trade") || err.message.includes("Steam Guard"))
                    resolve(false);
                return reject(err);
            }
            if (response.statusCode == 200) {
                resolve(true);
            } else {
                reject(new Error(`${response.statusCode}: ${response.statusMessage}`));
            }
        });
    });
}