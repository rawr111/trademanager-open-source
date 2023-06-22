import { makeAutoObservable } from 'mobx';
import ProxiesTableStore from './ProxiesTableStore/ProxiesTableStore';
import WindowStore from './WindowStore';
import TabsStore from './TabStore';
import SteamAccountsTableStore from './SteamAccountsTableStore/SteamAccountsTableStore';

export class Store {
    steamAccountsTable: SteamAccountsTableStore;
    proxiesTable: ProxiesTableStore;
    windows: WindowStore;
    tabs: TabsStore;

    constructor() {
        this.steamAccountsTable = new SteamAccountsTableStore(this);
        this.proxiesTable = new ProxiesTableStore(this);
        this.windows = new WindowStore(this);
        this.tabs = new TabsStore(this);
        makeAutoObservable(this);

        window.Main.onError((event, error)=>{
            alert(error);
        });
    }
}

export default window.getWindowName() === 'main' ? new Store() : {} as Store;