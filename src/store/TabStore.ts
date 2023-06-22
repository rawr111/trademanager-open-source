import { Store } from "./store";
import { makeAutoObservable } from 'mobx';

type Tab = 'steamAccounts' | 'proxies' | 'extensions' | 'support';

class TabsStore {
    root: Store;
    active: Tab;

    constructor (root: Store){
        this.root = root;
        this.active = 'steamAccounts';
        
        makeAutoObservable(this);
    }

    setActive(tab: Tab){
        console.log(tab)
        if (tab === 'steamAccounts'){
            window.Main.steamAccounts.get();
            window.Main.steamAccounts.getTableFields();
        }
        this.active = tab;
    }
}

export default TabsStore;