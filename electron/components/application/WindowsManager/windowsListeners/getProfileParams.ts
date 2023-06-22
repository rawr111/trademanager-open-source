import { IpcMainEvent } from 'electron';
import application from '../../application';
import WindowChannels from '../../../../interfaces/IpcChannels/WindowsChannels';

export default (event: IpcMainEvent) => {
    try {
        const profileParams = application.currentProfile;
        event.reply(WindowChannels.GET_PROFILE_PARAMS,profileParams);
    } catch (err) {
        event.reply('ERROR', err)
    }
}