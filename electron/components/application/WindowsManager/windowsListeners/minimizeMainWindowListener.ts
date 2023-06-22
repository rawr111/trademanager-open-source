import { IpcMainEvent } from 'electron';
import application from '../../application';

export default (event: IpcMainEvent) => {
    try {
        application.windowsManager.mainWindow?.minimize();
    } catch (err) {
        event.reply('ERROR', err);
    }
}