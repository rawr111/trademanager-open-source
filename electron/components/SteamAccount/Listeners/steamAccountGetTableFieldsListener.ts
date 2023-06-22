import SteamAccountChannels from "../../../interfaces/IpcChannels/SteamAccountChannels";
import TableStorage from "../../newStorage/TableStorage";

export default async (event: Electron.IpcMainEvent) => {
    try {
        const fields = TableStorage.GetFields('steamAccounts');
        event.reply(SteamAccountChannels.STEAM_ACCOUNT_GET_TABLE_FIELDS, fields);
    } catch (err) {
        event.reply('ERROR', err);
    }
}