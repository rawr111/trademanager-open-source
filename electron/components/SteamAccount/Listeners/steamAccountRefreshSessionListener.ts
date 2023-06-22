import SteamAccountChannels from "../../../interfaces/IpcChannels/SteamAccountChannels";
import steamAccountManager from "../steamAccountManager";

export default async (event: Electron.IpcMainEvent, id: string) => {
    try {
        const steamAccount = steamAccountManager.getById(id);
        if (!steamAccount) throw new Error(`Такого стим аккаунта не сущесвует (#${id})`);
        await steamAccount.loginByPassword();
        event.reply(SteamAccountChannels.STEAM_ACCOUNT_REFRESH_SESSION, id);
    } catch (err) {
        event.reply(SteamAccountChannels.STEAM_ACCOUNT_REFRESH_SESSION_ERROR, { id, err });
    }
}