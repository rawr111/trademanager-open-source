import SmaFileInterface from "../../../interfaces/SteamAccount/SmaFileInterface";
import Manager from "../../manager/manager";
import steamAccountImport from "../Processes/steamAccountImport";
import steamAccountManager from "../steamAccountManager";

export default (event: Electron.IpcMainEvent, accounts: [{ smaFile: SmaFileInterface, links: { proxyId: string | null, profileId: string | null } }]) => {
    try {
        for (var account of accounts) {
            const steamAccount = steamAccountImport(account.smaFile);
            if (account.links.proxyId) Manager.LinkProxyToSteamAccount(steamAccount.id, account.links.proxyId);
        }
        steamAccountManager.sendAccountsToFront();
    } catch (err) {
        event.reply('ERROR', err);
    }
}