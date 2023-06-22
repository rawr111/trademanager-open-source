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

        //ЭТА ФУНКЦИЯ ПОКА ЧТО ЗАЛОЧЕНА
        window.Main.window.onGetSecretKey(() => {
            this.windows.prompt({
                title: "Введите ключ шифрования",
                text: "Ваши данные зашифрованы с помощью специального ключа. Пожалуйста введите его в поле ниже и программа сможет продолжить работу",
                type: "question",
                isInput: true,
                cb: (text) => {
                    window.Main.window.getSecretKey(text);
                }
            });
        });

        window.Main.onError((event, error) => {
            alert(error);
        });
    }
}

export default window.getWindowName() === 'main' ? new Store() : {} as Store;