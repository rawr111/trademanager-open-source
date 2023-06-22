import { IpcMainEvent } from 'electron';
import application from "../../application";

export default (event: IpcMainEvent) => {
    try {
        const win = application.windowsManager.authWindow;
        if (win) win.maximize();
    } catch (err){
        event.reply('ERROR', err);
    }
}