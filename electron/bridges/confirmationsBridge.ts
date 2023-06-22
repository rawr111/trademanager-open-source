import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import CConfirmation from 'steamcommunity/classes/CConfirmation';
import SteamAccountChannels from '../interfaces/IpcChannels/SteamAccountChannels';
import WindowsChannels from '../interfaces/IpcChannels/WindowsChannels';

/** Методы для работы с беком приложения */
const api = {
  getParams(id: string) { ipcRenderer.send(WindowsChannels.GET_CONFIRMATIONS_WINDOW_PARMAS, id); },
  onGetParams(listener: (event: IpcRendererEvent, params: { id: string, steamAccountName: string }) => void) {
    ipcRenderer.on(WindowsChannels.GET_CONFIRMATIONS_WINDOW_PARMAS, listener);
  },
  getConfirmations(id: string) {
    ipcRenderer.send(SteamAccountChannels.STEAM_ACCOUNT_GET_CONFIRMATIONS, id);
  },
  onGetConfirmations(listener: (event: IpcRendererEvent, data: { id: string, confirmations: CConfirmation[] }) => void) {
    ipcRenderer.on(SteamAccountChannels.STEAM_ACCOUNT_GET_CONFIRMATIONS, listener);
  },
  onGetConfirmationsError(listener: (event: IpcRendererEvent, data: { id: string, err: string }) => void) {
    ipcRenderer.on(SteamAccountChannels.STEAM_ACCOUNT_GET_CONFIRMATIONS_ERROR, listener);
  },
  respondConfirmations(
    id: string,
    data: {
      allow: {
        ids: number[],
        keys: string[]
      },
      cancel: {
        ids: number[],
        keys: string[]
      }
    }
  ) {
    ipcRenderer.send(SteamAccountChannels.STEAM_ACCOUNT_CONFIRM, {
      id: id,
      data: data
    });
  },
  onRespondconfirmations(listener: (event: IpcRendererEvent, id: string) => void) {
    ipcRenderer.on(SteamAccountChannels.STEAM_ACCOUNT_CONFIRM, listener);
  }
}

const windowApi = {
  /** Закрыть окно подтверждений*/
  close: (id: string) => { ipcRenderer.send(WindowsChannels.CLOSE_CONFIRMATIONS_WINDOW, id); },
  /** Отцентрировать окно подтверждений */
  centerize: (id: string) => { ipcRenderer.send(WindowsChannels.CENTERIZE_CONFIRMATIONS_WINDOW, id); },
  /** Сделать размер окна подтверждений минимально возможным */
  minimize: (id: string) => { ipcRenderer.send(WindowsChannels.MINIMIZE_CONFIRMATIONS_WINDOW, id); },
  /** Сделать размер окна подтверждений максимально возможным */
  maximize: (id: string) => { ipcRenderer.send(WindowsChannels.MAXIMIZE_CONFIRMATIONS_WINDOW, id); }
}

export default { api, windowApi };

contextBridge.exposeInMainWorld('Confirmations', { api, windowApi });
contextBridge.exposeInMainWorld('getWindowName', () => 'confirmations');