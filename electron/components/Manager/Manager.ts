import proxyManager, { ProxyManager } from "../Proxy/proxyManager";
import steamAccountManager, { SteamAccountManager } from "../SteamAccount/steamAccountManager";
import LinksStorage from "../newStorage/LinksStorage";
import SteamAccountInterface from "../../interfaces/SteamAccount/SteamAccountInterface";
import application from "../application/application";
import SteamAccountChannels from "../../interfaces/IpcChannels/SteamAccountChannels";

class Manager {
    static GetSteamAccountLinkedData(steamAccountId: string) {
        const links = LinksStorage.Get();
        const proxyId = links.steamAccounts[steamAccountId];
        const proxy = proxyId ? proxyManager.getById(proxyId) : null;
        return {
            proxy: proxy ? proxy.params : null
        };
    }
    static GetProxyLinkedData(proxyId: string) {
        const links = LinksStorage.Get();

        const steamAccountIds: string[] = [];
        for (var saId of Object.keys(links.steamAccounts)) {
            const prId = links.steamAccounts[saId];
            if (prId === proxyId) {
                steamAccountIds.push(saId);
            }
        }
        const steamAccounts: SteamAccountInterface[] = [];
        for (var steamAccountId of steamAccountIds) {
            const steamAccount = steamAccountManager.getById(steamAccountId);
            if (steamAccount) steamAccounts.push(steamAccount.params);
        }

        return {
            steamAccounts
        };
    }

    static ResetProxy(proxyId: string) {
        const links = LinksStorage.Get();
        for (var steamAccountId of Object.keys(links.steamAccounts)) {
            if (links.steamAccounts[steamAccountId] === proxyId) {
                links.steamAccounts[steamAccountId] = null;
            }
        }

        LinksStorage.Save(links);
    }
    static LinkProxyToSteamAccount(steamAccountId: string, proxyId: string | null) {
        const links = LinksStorage.Get();
        links.steamAccounts[steamAccountId] = proxyId;
        LinksStorage.Save(links);
        if (proxyId) {
            const proxies = proxyManager.getCompiledObjects();
            const proxy = proxies.filter(p => p.id === proxyId)[0];
            const steamAccount = steamAccountManager.getById(steamAccountId);
            if (!steamAccount) throw new Error(`steam account #${steamAccountId} is not exist`);
            steamAccount.setProxy(proxy);
            application.sendToMain(SteamAccountChannels.STEAM_ACCOUNT_EDIT_PROXY, { id: steamAccountId, proxy: proxy ? proxy : null });
        } else {
            const steamAccount = steamAccountManager.getById(steamAccountId);
            if (!steamAccount) throw new Error(`steam account #${steamAccountId} is not exist`);
            steamAccount.setProxy(null);
            application.sendToMain(SteamAccountChannels.STEAM_ACCOUNT_EDIT_PROXY, { id: steamAccountId, proxy: null })
        }
        proxyManager.sendProxiesToFront();
    }

    static Load() {
        proxyManager.load();
        steamAccountManager.load();
    }
}

export default Manager;