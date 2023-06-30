import { IpcMainEvent } from 'electron';
import application from '../../application';
import WindowsChannels from '../../../../interfaces/IpcChannels/WindowsChannels';

export default (event: IpcMainEvent) => {
    try {
        event.reply(WindowsChannels.GET_MAXIMIZE_STATUS_MAIN_WINDOW, application.windowsManager.mainWindow?.isMaximized());
    } catch (err) {
        event.reply('ERROR', err)
    }
}