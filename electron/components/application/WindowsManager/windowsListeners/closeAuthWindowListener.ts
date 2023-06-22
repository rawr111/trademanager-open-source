import { IpcMainEvent } from 'electron';
import application from "../../application";

export default (event: IpcMainEvent) => {
    try {
        application.windowsManager.authWindow?.close();
        application.object.exit();
    } catch (err){
        event.reply('ERROR', err);
    }
}