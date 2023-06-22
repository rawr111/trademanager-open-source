import SteamAccountChannels from '../../../interfaces/IpcChannels/SteamAccountChannels';
import steamAccountManager from './../steamAccountManager';

export default async (event: Electron.IpcMainEvent, id: string) => {
    try {
        const account = steamAccountManager.getById(id);
        if (!account) {
            throw new Error(`Такого аккаунта #${id} не существует!`);
        }
        event.reply(SteamAccountChannels.GET_BROWSER_STARTUS, { status: account.chrome.workStatus, id});
    } catch (err) {
        event.reply('ERROR', err);
    }
}