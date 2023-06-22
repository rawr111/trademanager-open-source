import TableSteamAccountInterface from "../../../electron/interfaces/SteamAccount/TableSteamAccountInterface";
import SteamAccountsTableStore from "./SteamAccountsTableStore";
import ProxySetupInterface from "../../../electron/interfaces/Proxy/ProxySetupInterface";
import { makeAutoObservable, toJS } from 'mobx';

class EditingFormStore {
    root: SteamAccountsTableStore;
    isOpen: boolean;
    content: {
        steamAccount: TableSteamAccountInterface,
        proxy: {
            new: ProxySetupInterface,
            savedId: string | null
        }
    };
    switches: {
        proxy: 'noProxy' | 'newProxy' | 'savedProxy'
    }

    constructor(root: SteamAccountsTableStore) {
        this.root = root;
        this.isOpen = false;
        this.content = {
            steamAccount: {} as TableSteamAccountInterface,
            proxy: {
                new: { host: '', port: '', username: '', password: '' },
                savedId: null
            }
        }
        this.switches = { proxy: 'noProxy' };

        makeAutoObservable(this);
    }

    open(steamAccount: TableSteamAccountInterface) {
        this.isOpen = true;
        this.content.steamAccount = steamAccount;
        this.content.proxy.savedId = steamAccount.proxy ? steamAccount.proxy.id : null;
        this.content.proxy.new = { host: '', port: '', username: '', password: '' };
        if (steamAccount.proxy) {
            this.switches.proxy = 'savedProxy';
        } else {
            this.switches.proxy = 'noProxy';
        }

    }
    close() { this.isOpen = false; }
    getContent() { return toJS(this.content); }
    getSwitches() { return toJS(this.switches); }
    editContent(newContent: { [K in keyof typeof this.content]?: typeof this.content[K] }) {
        this.content = { ...this.content, ...newContent };
    }
    editSwitches(newSwitches: { [K in keyof typeof this.switches]?: typeof this.switches[K] }) { this.switches = { ...this.switches, ...newSwitches }; }
}

export default EditingFormStore;