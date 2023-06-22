import steamAccountManager from "../steamAccountManager";

export default (event: Electron.IpcMainEvent) => {
    try {
        steamAccountManager.sendAccountsToFront();
    } catch (err) {
        event.reply('ERROR', err);
    }
}