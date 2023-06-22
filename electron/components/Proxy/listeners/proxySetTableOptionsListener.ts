import TableStorage from "../../newStorage/TableStorage";
import TableOptions from "../../../interfaces/TableOptions/TableOptions";

export default (event: Electron.IpcMainEvent, options: TableOptions) => {
    try {
        TableStorage.EditOptions('proxies', options);
    } catch (err) {
        event.reply('ERROR', err);
    }
}