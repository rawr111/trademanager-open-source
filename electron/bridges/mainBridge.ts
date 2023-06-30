import { contextBridge, IpcMainEvent, ipcRenderer, IpcRendererEvent, session, shell } from 'electron';
import Field from '../interfaces/TableFields/Field';
import CompiledProxyInterface from '../interfaces/Proxy/CompiledProxyInterface';
import TableProxyInterface from '../interfaces/Proxy/TableProxyInterface';
import SteamAccountSetupInterface from '../interfaces/SteamAccount/SteamAccountSetupInterface';
import TableSteamAccountInterface from '../interfaces/SteamAccount/TableSteamAccountInterface';
import CompiledSteamAccountInterface from '../interfaces/SteamAccount/CompiledSteamAccountInterface';
import SmaFileInterface from '../interfaces/SteamAccount/SmaFileInterface';
import CreationStepType from '../interfaces/SteamAccount/CreationStepType';
import ProxySetupInterface from '../interfaces/Proxy/ProxySetupInterface';
import ChangableSecondaryInterface from '../interfaces/SteamAccount/ChangableSecondaryInterface';
import SecondaryInterface from '../interfaces/SteamAccount/SecondaryInterface';
import { exec } from 'child_process';
import SteamAccountChannels from '../interfaces/IpcChannels/SteamAccountChannels';
import ProxyChannels from '../interfaces/IpcChannels/ProxyChannels';
import TableOptions from '../interfaces/TableOptions/TableOptions';
import WindowsChannels from '../interfaces/IpcChannels/WindowsChannels';
import path from "path";
import Store from "electron-store";

const SteamTotp = require('steam-totp');

const setRequestHeaders = () => {
  console.log(session);
  if (!session) return;

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    console.log('*');
    callback({
      responseHeaders: Object.assign({
        ...details.responseHeaders,
        "Content-Security-Policy": ["default-src 'self' 'unsafe-inline' data:"]
      }, details.responseHeaders)
    });
  });
}

const steamAccounts = {
  getBrowserStatus(id: string) {
    ipcRenderer.send(SteamAccountChannels.GET_BROWSER_STARTUS, id);
  },
  onGetBrowserStatus(listener: (event: IpcRendererEvent, data: { id: string, status: 'load' | 'working' | 'notworking' }) => void) {
    ipcRenderer.on(SteamAccountChannels.GET_BROWSER_STARTUS, listener);
  },
  startBrowser(id: string) {
    ipcRenderer.send(SteamAccountChannels.START_BROWSER, id);
  },
  stopBrowser(id: string) {
    ipcRenderer.send(SteamAccountChannels.STOP_BROWSER, id);
  },
  focusBrowser(id: string) {
    console.log(id);
    ipcRenderer.send(SteamAccountChannels.FOCUS_BROWSER, id);
  },
  openConfirmations(params: { id: string, steamAccountName: string }) {
    ipcRenderer.send(WindowsChannels.OPEN_CONFIRMATIONS_WINDOW, params);
  },
  refreshSession(id: string) {
    ipcRenderer.send(SteamAccountChannels.STEAM_ACCOUNT_REFRESH_SESSION, id);
  },
  onRefreshSession(listener: (event: IpcRendererEvent, id: string) => void) {
    ipcRenderer.on(SteamAccountChannels.STEAM_ACCOUNT_REFRESH_SESSION, listener);
  },
  onRefreshSessionError(listener: (event: IpcRendererEvent, data: { id: string, err: Error }) => void) {
    ipcRenderer.on(SteamAccountChannels.STEAM_ACCOUNT_REFRESH_SESSION_ERROR, listener);
  },
  creationProcess: (steamAccount: SteamAccountSetupInterface, links: { proxyId: string | null, newProxy: ProxySetupInterface | null }) => {
    console.log(steamAccount, links);
    ipcRenderer.send(SteamAccountChannels.STEAM_ACCOUNT_CREATE_PROCESS, { steamAccount: steamAccount, links })
  },
  onCreationProcessStep(listener: (event: IpcRendererEvent, step: CreationStepType) => void) {
    ipcRenderer.on(SteamAccountChannels.STEAM_ACCOUNT_CREATE_PROCESS_STEP, listener);
  },
  onCreationProcessError(listener: (event: IpcRendererEvent, err: string) => void) {
    ipcRenderer.on(SteamAccountChannels.STEAM_ACCOUNT_CREATE_PROCESS_ERROR, listener);
  },
  edit: (id: string, steamAccountParams: { [K in keyof TableSteamAccountInterface]?: TableSteamAccountInterface[K] }, links?: { proxyId: null | string }) => {
    ipcRenderer.send(SteamAccountChannels.STEAM_ACCOUNT_EDIT, { id, steamAccountParams, links });
  },
  import: (accounts: { smaFile: SmaFileInterface, links: { proxyId: null | string } }[]) => {
    ipcRenderer.send(SteamAccountChannels.STEAM_ACCOUNT_IMPORT, accounts);
  },
  delete: (id: string) => {
    ipcRenderer.send(SteamAccountChannels.STEAM_ACCOUNT_DELETE, id);
  },
  get: () => {
    ipcRenderer.send(SteamAccountChannels.STEAM_ACCOUNT_GET);
  },
  onGet: (listener: (event: IpcRendererEvent, steamAccounts: CompiledSteamAccountInterface[]) => void) => {
    ipcRenderer.on(SteamAccountChannels.STEAM_ACCOUNT_GET, listener);
  },
  refresh: () => {
    ipcRenderer.send(SteamAccountChannels.STEAM_ACCOUNT_REFRESH_STORAGE);
  },
  getTableFields: () => {
    ipcRenderer.send(SteamAccountChannels.STEAM_ACCOUNT_GET_TABLE_FIELDS);
  },
  onGetTableFields: (listener: (event: IpcRendererEvent, fields: Field[]) => void) => {
    ipcRenderer.on(SteamAccountChannels.STEAM_ACCOUNT_GET_TABLE_FIELDS, listener);
  },
  saveTableFields(fields: Field[]) {
    ipcRenderer.send(SteamAccountChannels.STEAM_ACCOUNT_SET_TABLE_FIELDS, fields);
  },
  getChangableSecondary(id: string) {
    console.log(id);
    ipcRenderer.send(SteamAccountChannels.STEAM_ACCOUNT_GET_CHANGABLE_SECONDARY, id);
  },
  onGetChangableSecondary(listener: (event: IpcRendererEvent, data: { changableSecondary: ChangableSecondaryInterface, id: string }) => void) {
    ipcRenderer.on(SteamAccountChannels.STEAM_ACCOUNT_GET_CHANGABLE_SECONDARY, listener);
  },
  onGetChangableSecondaryError(listener: (event: IpcRendererEvent, data: { err: Error, id: string }) => void) {
    ipcRenderer.on(SteamAccountChannels.STEAM_ACCOUNT_GET_CHANGABLE_SECONDARY_ERROR, listener);
  },
  getSecondary(id: string) {
    ipcRenderer.send(SteamAccountChannels.STEAM_ACCOUNT_GET_SECONDARY, id);
  },
  onGetSecondary(listener: (event: IpcRendererEvent, data: { id: string, secondary: SecondaryInterface }) => void) {
    ipcRenderer.on(SteamAccountChannels.STEAM_ACCOUNT_GET_SECONDARY, listener);
  },
  onGetSecondaryError(listener: (event: IpcRendererEvent, data: { id: string, err: string }) => void) {
    ipcRenderer.on(SteamAccountChannels.STEAM_ACCOUNT_GET_SECONDARY_ERROR, listener);
  },
  sendFamilyPin: (pin: string) => {
    ipcRenderer.send('ENTER_FAMILY_PIN', pin);
  },
  abortCreation() {
    ipcRenderer.send('ABORT_LOGIN_BY_MAFILE');
  },
  getTableOptions() {
    ipcRenderer.send(SteamAccountChannels.STEAM_ACCOUNT_GET_TABLE_OPTIONS);
  },
  onGetTableOptions(listener: (event: IpcRendererEvent, options: TableOptions) => void) {
    ipcRenderer.on(SteamAccountChannels.STEAM_ACCOUNT_GET_TABLE_OPTIONS, listener);
  },
  setTableOptions(options: TableOptions) {
    ipcRenderer.send(SteamAccountChannels.STEAM_ACCOUNT_SAVE_TABLE_OPTIONS, options);
  },
  onEditProxy(listener: (event: IpcRendererEvent, data: { id: string, proxy: TableProxyInterface | null }) => void) {
    ipcRenderer.on(SteamAccountChannels.STEAM_ACCOUNT_EDIT_PROXY, listener);
  }
}


const proxies = {
  new: (proxy: ProxySetupInterface, links: { steamAccountIds: string[] }) => {
    ipcRenderer.send('NEW_PROXY', { proxy, links });
  },
  edit: (id: string, proxy: { [K in keyof TableProxyInterface]?: TableProxyInterface[K] }, links: { steamAccountIds: string[] }) => {
    console.log(id, proxy, links)
    ipcRenderer.send('EDIT_PROXY', { id, proxy, links });
  },
  delete: (id: string) => {
    ipcRenderer.send('DELETE_PROXY', id);
  },
  /** Получение информации о всех прокси (запрос)  */
  get: () => {
    ipcRenderer.send('GET_PROXIES');
  },
  /** Получение информации о всех прокси (слушатель)  */
  onGet: (listener: (event: IpcRendererEvent, proxies: CompiledProxyInterface[]) => void) => {
    ipcRenderer.on('GET_PROXIES', listener);
  },
  refresh: () => {
    ipcRenderer.send('REFRESH_PROXIES');
  },
  /** Получение сохраненных полей для таблицы прокси (запрос) */
  getTableFields: () => {
    ipcRenderer.send('GET_PROXIES_TABLE_FIELDS');
  },
  /** Получение сохраненных полей для таблицы прокси (слушатель) */
  onGetTableFields: (listener: (event: IpcRendererEvent, fields: Field[]) => void) => {
    ipcRenderer.on('GET_PROXIES_TABLE_FIELDS', listener);
  },
  saveTableFields(fields: Field[]) {
    ipcRenderer.send('SAVE_PROXIES_TABLE_FIELDS', fields);
  },
  test(id: string) {
    ipcRenderer.send('TEST_PROXY', id);
  },
  testByParams(proxy: ProxySetupInterface) {
    ipcRenderer.send('TEST_PROXY_BY_PARAMS', proxy);
  },
  onTest(listener: (event: IpcRendererEvent, params: { id: string, testResult: boolean }) => void) {
    ipcRenderer.on('TEST_PROXY', listener);
  },
  getTableOptions() {
    ipcRenderer.send(ProxyChannels.PROXY_GET_TABLE_OPTIONS);
  },
  onGetTableOptions(listener: (event: IpcRendererEvent, options: TableOptions) => void) {
    ipcRenderer.on(ProxyChannels.PROXY_GET_TABLE_OPTIONS, listener);
  },
  setTableOptions(options: TableOptions) {
    ipcRenderer.send(ProxyChannels.PROXY_SET_TABLE_OPTIONS, options);
  }
}

const window = {
  openAppdata: () => {
    const store = new Store();
    const folderPath = path.dirname(store.path);

    switch (process.platform) {
      case 'darwin':
        exec(`open ${folderPath}`);
        break;
      case 'win32':
        exec(`start ${folderPath}`);
        break;
      default:
        exec(`xdg-open ${folderPath}`);
    }
  },
  openLink: (link: string = "http://www.google.com") => {
    shell.openExternal(link);
  },
  /** Закрыть главное окно */
  close: () => {
    ipcRenderer.send(WindowsChannels.CLOSE_MAIN_WINDOW);
  },
  /** Отцентрировать главное окно */
  centerize: () => {
    ipcRenderer.send(WindowsChannels.CENTERIZE_MAIN_WINDOW);
  },
  /** Сделать размер главного окна минимально возможным */
  minimize: () => {
    ipcRenderer.send(WindowsChannels.MINIMIZE_MAIN_WINDOW);
  },
  /** Сделать размер главного окна максимально возможным */
  maximize: () => {
    ipcRenderer.send(WindowsChannels.MAXIMIZE_MAIN_WINDOW);
  },
  onGetSecretKey: (listener: (event: IpcRendererEvent) => void) => {
    ipcRenderer.on(WindowsChannels.GET_SECRET_KEY, listener);
  },
  getSecretKey: (key: string) => ipcRenderer.send(WindowsChannels.GET_SECRET_KEY, key),
  setSecretKey: (key: string) => {
    ipcRenderer.send(WindowsChannels.SET_SECRET_KEY, key)
  },
  getMaximizeMainWindowStatus: () => ipcRenderer.send(WindowsChannels.GET_MAXIMIZE_STATUS_MAIN_WINDOW),
  onMaximizeMainWindowStatus: (listener: (event: IpcRendererEvent, isMaximized: boolean) => void) => {
    ipcRenderer.on(WindowsChannels.GET_MAXIMIZE_STATUS_MAIN_WINDOW, listener);
  }
}

const guardConnection = {
  setup(params: { accountName: string, password: string, tmApiKey?: string }, links: { proxyId: string | null, newProxy: ProxySetupInterface | null }) {
    ipcRenderer.send(SteamAccountChannels.GUARD_SETUP_PROCESS, { ...params, links });
  },
  onSetupError: (listener: (event: IpcRendererEvent, error: string) => void) => {
    ipcRenderer.on(SteamAccountChannels.GUARD_SETUP_PROCESS_ERROR, listener);
  },
  onGetAuthCode: (listener: (event: IpcRendererEvent, data: { code: string, id: string }) => void) => {
    ipcRenderer.on(SteamAccountChannels.STEAM_ACCOUNT_AUTH_CODE, listener);
  },
  onSetupStep: (listener: (event: IpcRendererEvent, step: CreationStepType) => void) => {
    ipcRenderer.on(SteamAccountChannels.GUARD_SETUP_PROCESS_STEP, listener);
  },
  abortSetup: () => {
    ipcRenderer.send('ABORT_SETUP_GUARD');
  },
  getAuthCode: (shared_secret: string) => {
    return SteamTotp.getAuthCode(shared_secret);
    //ipcRenderer.send(SteamAccountChannels.STEAM_ACCOUNT_AUTH_CODE, { id, shared_secret });
  }
}

/** Методы для работы с беком приложения */
const mainApi = {
  /** Методы для главного окна */
  window,
  /** Методы для steam аккаунтов */
  steamAccounts,
  /** Методы для прокси */
  proxies,
  /**Методы для подключения гуарда */
  guardConnection,

  setRequestHeaders,

  onError: (listener: (event: IpcRendererEvent, error: string) => void) => {
    ipcRenderer.on('ERROR', listener);
  }
}

export default mainApi;

contextBridge.exposeInMainWorld('Main', mainApi);
contextBridge.exposeInMainWorld('getWindowName', () => 'main');