import steamAccountManager from "../steamAccountManager";

export default async (event: Electron.IpcMainEvent) => {
    try {
        steamAccountManager.load();
    } catch (err) {
        event.reply('ERROR', err);
    }
}