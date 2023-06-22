import { IpcMainEvent } from 'electron';
import application from '../../application';

export default (event: IpcMainEvent, id: string) => {
    try {
        const win = application.windowsManager.askWindows[id];
        if (win) {
            win.unmaximize();
            const minSize = win.getMinimumSize();
            if (minSize) win.setSize(minSize[0], minSize[1]);
            win.center();
        }
    } catch (err) {
        event.reply('ERROR', err);
    }
}