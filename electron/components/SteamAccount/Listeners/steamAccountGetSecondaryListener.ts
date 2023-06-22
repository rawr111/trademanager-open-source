import steamAccountManager from "../steamAccountManager";
import SteamAccountChannels from "../../../interfaces/IpcChannels/SteamAccountChannels";

export default async (event: Electron.IpcMainEvent, id: string) => {
    try {
        const steamAccount = steamAccountManager.getById(id);
        if (!steamAccount) throw new Error(`Такого стим аккаунта не сущесвует (#${id})`);
        const secondary = await steamAccount.getSecondary();
        console.log(SteamAccountChannels.STEAM_ACCOUNT_GET_SECONDARY, { id: id, secondary: secondary });
        event.reply(SteamAccountChannels.STEAM_ACCOUNT_GET_SECONDARY, { id: id, secondary: secondary });
    } catch (err) {
        event.reply(SteamAccountChannels.STEAM_ACCOUNT_GET_SECONDARY_ERROR, { id, err });
    }
}