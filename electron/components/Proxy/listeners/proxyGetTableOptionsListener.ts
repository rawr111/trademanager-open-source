import TableStorage from "../../newStorage/TableStorage";
import ProxyChannels from "../../../interfaces/IpcChannels/ProxyChannels";

export default (event: Electron.IpcMainEvent) => {
    try {
        const options = TableStorage.GetOptions('proxies');
        if (!options || Object.keys(options).length === 0) return event.reply(ProxyChannels.PROXY_GET_TABLE_OPTIONS, {
            pageSize: 10,
            activePage: 1
        });
        event.reply(ProxyChannels.PROXY_GET_TABLE_OPTIONS, options);
    } catch (err) {
        event.reply('ERROR', err);
    }
}