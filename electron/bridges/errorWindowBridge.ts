import { contextBridge, ipcRenderer, IpcRendererEvent, shell } from 'electron';
import WindowsChannels from './interfaces/IpcChannels/WindowsChannels';

const errorApi = {
    openLink: () => {
        shell.openExternal("http://www.google.com")
    }
}
const windowApi = {
    close: (id: string) => { ipcRenderer.send(WindowsChannels.CLOSE_ERROR_WINDOW, id); },
    centerize: (id: string) => { ipcRenderer.send(WindowsChannels.CENTERIZE_ERROR_WINDOW, id); },
    minimize: (id: string) => {console.log(id); ipcRenderer.send(WindowsChannels.MINIMIZE_ERROR_WINDOW, id); },
    maximize: (id: string) => { ipcRenderer.send(WindowsChannels.MAXIMIZE_ERROR_WINDOW, id); },
    onGetParams: (listener: (event: IpcRendererEvent, data: { id: string, title: string, text: string }) => void) => {
        ipcRenderer.on(WindowsChannels.GET_ERROR_WINDOW_PARAMS, listener);
    }
}

export default { errorApi, windowApi };

contextBridge.exposeInMainWorld('ErrorWindow', { errorApi, windowApi });
contextBridge.exposeInMainWorld('getWindowName', () => 'error');