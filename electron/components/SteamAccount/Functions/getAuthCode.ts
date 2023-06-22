import steamAccountManager from "../steamAccountManager";
import SteamAccountChannels from "../../../interfaces/IpcChannels/SteamAccountChannels";
const SteamTotp = require('steam-totp');

export default (event: Electron.IpcMainEvent, data: { id: string, shared_secret: string }) => {
    try {
        const code = SteamTotp.generateAuthCode(data.shared_secret);
        event.reply(SteamAccountChannels.STEAM_ACCOUNT_AUTH_CODE, { id: data.id, code })
    } catch (err) {
        event.reply(SteamAccountChannels.STEAM_ACCOUNT_AUTH_CODE_ERROR, `Ошибка при генерации Guard кода: ${err}`);
    }
}