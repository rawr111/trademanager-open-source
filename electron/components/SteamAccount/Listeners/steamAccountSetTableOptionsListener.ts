import TableStorage from "../../newStorage/TableStorage";
import TableOptions from "../../../interfaces/TableOptions/TableOptions";

export default async (event: Electron.IpcMainEvent, options: TableOptions) => {
    try {
        TableStorage.EditOptions('steamAccounts', options);
    } catch (err) {
        event.reply('ERROR', err);
    }
}