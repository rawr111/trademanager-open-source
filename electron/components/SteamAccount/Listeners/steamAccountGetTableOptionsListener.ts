import TableFieldStorage from "../../storage/TableFieldStorage";
import TableStorage from "../../newStorage/TableStorage";
import SteamAccountChannels from "../../../interfaces/IpcChannels/SteamAccountChannels";

export default (event: Electron.IpcMainEvent) => {
    try {
        const options = TableStorage.GetOptions("steamAccounts");
        if (!options || Object.keys(options).length === 0) return event.reply(SteamAccountChannels.STEAM_ACCOUNT_GET_TABLE_OPTIONS, {
            pageSize: 10,
            activePage: 1
        });
        event.reply(SteamAccountChannels.STEAM_ACCOUNT_GET_TABLE_OPTIONS, options);
    } catch (err) {
        event.reply('ERROR', err);
    }
}