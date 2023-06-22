import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import InfoType from "./components/application/askInfo/InfoType";
import WindowsChannels from "./interfaces/IpcChannels/WindowsChannels";
import AskSomethingChannels from "./interfaces/IpcChannels/AskSomethigChannels";

/** Методы для работы с беком приложения */
const askFamilyPinApi = {
    onGetParams(func: (event: any, data: { id: string, steamAccountName: string, infoType: InfoType }) => void) {
        ipcRenderer.on(WindowsChannels.GET_ASK_WINDOW_PARAMS, func);
    },
    sendData(id: string, data: string) {
        console.log(id, data);
        ipcRenderer.send(AskSomethingChannels.ASK_WINDOW_SEND_DATA, { id, data });
    },
    abort(id: string) {
        ipcRenderer.send(AskSomethingChannels.ASK_WINDOW_ABORT_SENDING_DATA, id);
    }
}

const windowApi = {
    /** Закрыть окно с вопросом */
    close: (id: string) => {
        ipcRenderer.send(WindowsChannels.CLOSE_ASK_WINDOW, id);
    },
    /** Отцентрировать окно с вопросом */
    centerize: (id: string) => {
        ipcRenderer.send(WindowsChannels.CENTERIZE_ASK_WINDOW, id);
    },
    /** Сделать размер главного окна с вопросом минимально возможным */
    minimize: (id: string) => {
        console.log(id);
        ipcRenderer.send(WindowsChannels.MINIMIZE_ASK_WINDOW, id);
    },
    /** Сделать размер окна с вопросом максимально возможным */
    maximize: (id: string) => {
        ipcRenderer.send(WindowsChannels.MAXIMIZE_ASK_WINDOW, id);
    },
}

export default { askFamilyPinApi, windowApi };

contextBridge.exposeInMainWorld('AskFamilyPin', { askFamilyPinApi, windowApi });
contextBridge.exposeInMainWorld('getWindowName', () => 'askFamilyPin');