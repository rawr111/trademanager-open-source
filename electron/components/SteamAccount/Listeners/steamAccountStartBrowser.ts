import { IpcMainEvent } from 'electron';
import steamAccountManager from '../steamAccountManager';

export default async (event: IpcMainEvent, id: string) => {
    try {
        const steamAccount = steamAccountManager.getById(id);
        if (!steamAccount) throw new Error(`Такого стим аккаунта #${id} не существует`);
        steamAccount.chrome.start();
    } catch (err) {
        event.reply('ERROR', err);
    }
}