import { IpcMainEvent } from 'electron';
import application from "../../application";

export default (event: IpcMainEvent, id: string) => {
    try {
        const win = application.windowsManager.askWindows[id];
        if (win) win.maximize();
    } catch (err){
        event.reply('ERROR', err);
    }
}