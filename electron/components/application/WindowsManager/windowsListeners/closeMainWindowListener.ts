import { IpcMainEvent } from 'electron';
import application from '../../application';

export default (event: IpcMainEvent) => {
    try {
        application.windowsManager.mainWindow?.close();
    } catch (err) {
        event.reply('ERROR', err)
    }
}