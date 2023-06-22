import steamAccountManager from "../steamAccountManager";
import SteamAccountChannels from "../../../interfaces/IpcChannels/SteamAccountChannels";

export default async (event: Electron.IpcMainEvent, id: string) => {
    try {
        const steamAccount = steamAccountManager.getById(id);
        if (!steamAccount) throw new Error(`Такого стим аккаунта не сущесвует (#${id})`);
        const changableSecondary = await steamAccount.getChangableSecondary();
        event.reply(SteamAccountChannels.STEAM_ACCOUNT_GET_CHANGABLE_SECONDARY, { id, changableSecondary });
    } catch (err) {
        event.reply(SteamAccountChannels.STEAM_ACCOUNT_GET_CHANGABLE_SECONDARY_ERROR, { err, id });
    }
}