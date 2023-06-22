import { IpcMainEvent } from 'electron';
import SteamAccountChannels from '../../../interfaces/IpcChannels/SteamAccountChannels';
import steamAccountManager from '../steamAccountManager';

export default async (event: IpcMainEvent, id: string) => {
    try {
        const steamAccount = steamAccountManager.getById(id);
        if (!steamAccount) throw new Error(`Steam аккаунта #${id} не существует!`);
        const confirmations = await steamAccount.getConfirmations();
        console.log(confirmations);
        event.reply(SteamAccountChannels.STEAM_ACCOUNT_GET_CONFIRMATIONS, { id, confirmations });
    } catch (err) {
        event.reply(SteamAccountChannels.STEAM_ACCOUNT_GET_CONFIRMATIONS_ERROR, { id, err });
    }
}