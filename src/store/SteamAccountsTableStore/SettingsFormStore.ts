import SteamAccountsTableStore from "./SteamAccountsTableStore";
import { makeAutoObservable } from 'mobx';

class SettingsFormStore {
    root: SteamAccountsTableStore;
    isOpen: boolean;

    constructor(root: SteamAccountsTableStore) {
        this.root = root;
        this.isOpen = false;

        makeAutoObservable(this);
    }
    open() { this.isOpen = true; }
    close() { this.isOpen = false; }
}

export default SettingsFormStore;