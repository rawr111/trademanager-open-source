import Store from 'electron-store';
import SteamAccountInterface from '../../interfaces/SteamAccount/SteamAccountInterface';
import cryptoUserData from './cryptoUserData';

const store = new Store();

class SteamAccountStorage {
    static GetAll() {
        const steamAccounts = store.get('steamAccounts');
        const decryptedSteamAccounts = cryptoUserData.decryptObject(steamAccounts);
        if (!decryptedSteamAccounts) return {};
        return decryptedSteamAccounts as { [id: string]: SteamAccountInterface };
    }
    static GetById(id: string) {
        const steamAccount = store.get(`steamAccounts.${id}`) as SteamAccountInterface;
        const decryptedSteamAccount = cryptoUserData.decryptObject(steamAccount);
        if (!decryptedSteamAccount) throw new Error(`SteamAccount ${id} is not exist`);
        return decryptedSteamAccount;
    }
    static EditData(id: string, newObject: { [K in keyof SteamAccountInterface]?: SteamAccountInterface[K] }) {
        const steamAccount = SteamAccountStorage.GetById(id);
        if (steamAccount.id != id) throw new Error(`${id} doesnt match with ${steamAccount.id}`);
        SteamAccountStorage.Save(id, { ...steamAccount, ...newObject });
    }
    static Save(id: string, steamAccount: SteamAccountInterface) {
        const encryptedSteamAccount = cryptoUserData.encryptObject(steamAccount);
        store.set(`steamAccounts.${id}`, encryptedSteamAccount);
    }
    static Delete(id: string) {
        store.delete(`steamAccounts.${id}`);
    }
}

export default SteamAccountStorage;