import steamAccountManager from './../steamAccountManager';
import { IpcMainEvent, IpcRendererEvent } from 'electron';
import SteamAccountChannels from '../../../interfaces/IpcChannels/SteamAccountChannels';

export default async (event: IpcMainEvent, params: { id: string, data: { allow: { ids: number[], keys: string[] }, cancel: { ids: number[], keys: string[] } } }) => {
    try {
        const steamAccount = steamAccountManager.getById(params.id);
        if (!steamAccount) throw new Error(`steam account #${params.id} is not exist!`);

        if (params.data.allow.ids.length > 0) {
            await steamAccount.confirmItems(params.data.allow.ids, params.data.allow.keys);
        }
        if (params.data.cancel.ids.length > 0) {
            await steamAccount.cancelItems(params.data.cancel.ids, params.data.cancel.keys);
        }
        event.reply(SteamAccountChannels.STEAM_ACCOUNT_CONFIRM, params.id);
    } catch (err) {
        event.reply('ERROR', err);
    }
}