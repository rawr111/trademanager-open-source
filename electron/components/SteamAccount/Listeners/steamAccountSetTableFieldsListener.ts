import Field from "../../../interfaces/TableFields/Field";
import TableStorage from "../../newStorage/TableStorage";

export default (event: Electron.IpcMainEvent, fields: Field[]) => {
    try {
        TableStorage.EditFields('steamAccounts', fields);
    } catch (err) {
        event.reply('ERROR', err);
    }
}