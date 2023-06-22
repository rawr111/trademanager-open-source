import steamAccountManager from "../steamAccountManager";

export default async (event: Electron.IpcMainEvent, id: string) => {
    try {
        steamAccountManager.delete(id);
    } catch (err) {
        event.reply('ERROR', err);
    }
}