import { IpcMainEvent } from 'electron';
import application from '../../application';

export default (event: IpcMainEvent, params: { id: string, steamAccountName: string }) => {
    try {
        console.log(application.windowsManager.confirmationsWindows[params.id]);
        if (!application.windowsManager.confirmationsWindows[params.id])
            application.windowsManager.createConfirmationsWindow(params.id, params.steamAccountName);
        else application.windowsManager.confirmationsWindows[params.id].focus();
    } catch (err) {
        event.reply('ERROR', err);
    }
}