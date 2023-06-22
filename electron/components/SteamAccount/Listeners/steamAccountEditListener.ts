import TableSteamAccountInterface from "../../../interfaces/SteamAccount/TableSteamAccountInterface";
import Manager from "../../manager/manager";
import steamAccountManager from "../steamAccountManager";

export default async (event: Electron.IpcMainEvent, data: { id: string, steamAccountParams: { [K in keyof TableSteamAccountInterface]?: TableSteamAccountInterface[K] }, links?: { proxyId: string | null, profileId: string | null } }) => {
    try {
        console.log(`edit steam account ${data.id}`);
        console.log(data.steamAccountParams);
        const steamAccount = steamAccountManager.getById(data.id);
        console.log(steamAccount);
        if (!steamAccount) throw new Error(`Такого стим аккаунта не сущесвует (#${data.id})`);
        steamAccount.editParams(data.steamAccountParams);
        if (data.links)
            Manager.LinkProxyToSteamAccount(steamAccount.params.id, data.links.proxyId);
    } catch (err) {
        event.reply('ERROR', err);
    }
}