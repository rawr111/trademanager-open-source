import { IpcMainEvent } from 'electron';
import application from "../../application";

export default (event: IpcMainEvent) => {
    try {
        application.windowsManager.mainWindow?.unmaximize();
        const minSize = application.windowsManager.mainWindow?.getMinimumSize();
        if (minSize) application.windowsManager.mainWindow?.setSize(1200, 765);
        application.windowsManager.mainWindow?.center();
    } catch (err){
        event.reply('ERROR', err);
    }
}