import { IpcMainEvent } from 'electron';
import application from '../../application';
import { setCrypto } from '../../../newStorage/cryptoUserData';

//Данная функция пока не работает
export default (event: IpcMainEvent, key: string) => {
    try {
        console.log(key);
        if (!key || key.length < 8) throw new Error("Ключ некорректный. Нужно минимум 8 символов");
        setCrypto(key);
    } catch (err) {
        event.reply('ERROR', err);
    }
}