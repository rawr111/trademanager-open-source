import { IpcMainEvent } from 'electron';
import application from '../../application';

export default (event: IpcMainEvent, id: string) => {
    try {
        const win = application.windowsManager.confirmationsWindows[id];
        if (win) win.close();
    } catch (err) {
        event.reply('ERROR', err);
    }
}