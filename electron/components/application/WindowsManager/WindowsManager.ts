import path from 'path';
import electron, { BrowserWindow, ipcMain, IpcMainEvent } from 'electron';
import windowsConfig from './windowsConfig';
import WindowChannels from '../../../interfaces/IpcChannels/WindowsChannels';
import InfoType from '../askInfo/InfoType';
import AskSomethingChannels from '../../../interfaces/IpcChannels/AskSomethigChannels';
import { v4 as uuidv4 } from 'uuid';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;
declare const ASK_FAMILY_PIN_WINDOW_WEBPACK_ENTRY: string;
declare const ASK_FAMILY_PIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;
declare const CONFIRMATIONS_WINDOW_WEBPACK_ENTRY: string;
declare const CONFIRMATIONS_WINDOW_PRELOAD_WEBPACK_ENTRY: string;
declare const AUTH_WINDOW_WEBPACK_ENTRY: string;
declare const AUTH_WINDOW_PRELOAD_WEBPACK_ENTRY: string;
declare const ERROR_WINDOW_WEBPACK_ENTRY: string;
declare const ERROR_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

class WindowsManager {
    authWindow: BrowserWindow | null;
    mainWindow: BrowserWindow | null;
    askWindows: { [id: string]: BrowserWindow };
    confirmationsWindows: { [id: string]: BrowserWindow };
    errorWindows: { [id: string]: BrowserWindow };

    constructor() {
        this.authWindow = null;
        this.mainWindow = null;
        this.askWindows = {};
        this.confirmationsWindows = {};
        this.errorWindows = {};
    }

    createErrorWindow(title: string, text: string) {
        const winId = uuidv4();
        this.errorWindows[winId] = new BrowserWindow({
            ...windowsConfig.errorWindow,
            icon: path.join(__dirname, "../renderer/assets/newIcon.png"),
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                preload: ERROR_WINDOW_PRELOAD_WEBPACK_ENTRY
            }
        });
        this.errorWindows[winId].webContents.on('dom-ready', () => {
            setTimeout(async () => {
                this.errorWindows[winId].webContents.send(WindowChannels.GET_ERROR_WINDOW_PARAMS, { id: winId, title, text  });
            }, 50);
        });
        this.errorWindows[winId].focus();
        this.errorWindows[winId].loadURL(ERROR_WINDOW_WEBPACK_ENTRY);
    }
    createAuthWindow() {
        this.authWindow = new BrowserWindow({
            ...windowsConfig.authWindow,
            icon: path.join(__dirname, "../renderer/assets/newIcon.png"),
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                preload: AUTH_WINDOW_PRELOAD_WEBPACK_ENTRY
            }
        });
        this.authWindow.loadURL(AUTH_WINDOW_WEBPACK_ENTRY);
    }
    createMain() {
        this.mainWindow = new BrowserWindow({
            ...windowsConfig.mainWindow,
            icon: path.join(__dirname, "../renderer/assets/newIcon.png"),
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY
            }
        });
        this.mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
    }
    createConfirmationsWindow(id: string, steamAccountName: string) {
        return new Promise((resolve) => {
            const confirmationsWindow = new BrowserWindow({
                ...windowsConfig.confirmationsWindow,
                icon: path.join(__dirname, "../renderer/assets/confirmationsIcon.png"),
                webPreferences: {
                    nodeIntegration: false,
                    contextIsolation: true,
                    preload: CONFIRMATIONS_WINDOW_PRELOAD_WEBPACK_ENTRY
                }
            });
            this.confirmationsWindows[id] = confirmationsWindow;
            confirmationsWindow.loadURL(CONFIRMATIONS_WINDOW_WEBPACK_ENTRY);
            confirmationsWindow.webContents.on('dom-ready', () => {
                setTimeout(async () => {
                    confirmationsWindow.webContents.send(WindowChannels.GET_CONFIRMATIONS_WINDOW_PARMAS, { id, steamAccountName });
                    resolve(confirmationsWindow);
                }, 50);
            });
            confirmationsWindow.on('close', () => {
                delete (this.confirmationsWindows[id]);
            });
        });
    }
    createAskWindow(id: string, steamAccountName: string, infoType: InfoType): Promise<BrowserWindow> {
        return new Promise((resolve) => {
            const askWindow = new BrowserWindow({
                ...windowsConfig.askPinWindow,
                icon: path.join(__dirname, "../renderer/assets/newIcon.png"),
                webPreferences: {
                    nodeIntegration: false,
                    contextIsolation: true,
                    preload: ASK_FAMILY_PIN_WINDOW_PRELOAD_WEBPACK_ENTRY
                }
            });
            askWindow.loadURL(ASK_FAMILY_PIN_WINDOW_WEBPACK_ENTRY);
            askWindow.webContents.on('dom-ready', () => {
                setTimeout(() => {
                    askWindow.webContents.send(WindowChannels.GET_ASK_WINDOW_PARAMS, { id, steamAccountName, infoType });
                    resolve(askWindow);
                }, 50);
            });
            this.askWindows[id] = askWindow;
        });
    }
    askSomething(accountId: string, accountName: string, infoType: InfoType): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            const askPinWindow = await this.createAskWindow(accountId, accountName, infoType);
            let isGetInfo = false;

            const askFunc = (event: IpcMainEvent, data: { id: string, data: any }) => {
                try {
                    if (data.id != accountId) return;
                    listener.removeListener(AskSomethingChannels.ASK_WINDOW_SEND_DATA, askFunc);
                    errorListener.removeListener(AskSomethingChannels.ASK_WINDOW_ABORT_SENDING_DATA, abortFunc);
                    isGetInfo = true;
                    askPinWindow.close();
                    resolve(data.data);
                } catch (err) {
                    reject(err);
                }
            }
            const abortFunc = (event: IpcMainEvent, id: string) => {
                if (id != accountId) return;
                listener.removeListener(AskSomethingChannels.ASK_WINDOW_SEND_DATA, askFunc);
                errorListener.removeListener(AskSomethingChannels.ASK_WINDOW_ABORT_SENDING_DATA, abortFunc);
                askPinWindow.close();
                delete (this.askWindows[accountId]);
                reject("Добавление пин кода от семейного доступа прервано");
            }
            const listener = ipcMain.on(AskSomethingChannels.ASK_WINDOW_SEND_DATA, askFunc);
            const errorListener = ipcMain.on(AskSomethingChannels.ASK_WINDOW_ABORT_SENDING_DATA, abortFunc);

            askPinWindow.on('close', () => {
                delete (this.askWindows[accountId]);
                if (!isGetInfo) reject();
            });
        });
    }
}

export default WindowsManager;