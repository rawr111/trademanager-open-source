import Store from 'electron-store';
import TableOptions from '../../interfaces/TableOptions/TableOptions';
import Field from '../../interfaces/TableFields/Field';
import defaultSteamAccountTableFields from '../../interfaces/TableFields/defaults/steamAccountsTableFields';
import defaultProxyTableFields from '../../interfaces/TableFields/defaults/proxiesTableFields';

const defaultTableOptions = {
    pageSize: 10,
    activePage: 1
}

const store = new Store();

console.log(store.path);

type Table = 'steamAccounts' | 'proxies';

class TableStorage {
    static GetFields(type: Table) {
        const fields = store.get(`${type}TableFields`);
        if (!fields) {
            if (type === 'steamAccounts') {
                store.set(`${type}TableFields`, defaultSteamAccountTableFields);
                return defaultSteamAccountTableFields;
            }
            if (type === 'proxies') {
                store.set(`${type}TableFields`, defaultProxyTableFields);
                return defaultProxyTableFields;
            }
            throw new Error(`${type} - fields is undefined`);
        }
        return fields as Field[];
    }
    static GetOptions(type: Table) {
        const options = store.get(`${type}TableOptions`);
        if (!options) {
            if (type === 'steamAccounts') {
                store.set(`${type}TableOptions`, defaultTableOptions);
                return defaultTableOptions;
            }
            if (type === 'proxies') {
                store.set(`${type}TableOptions`, defaultTableOptions);
                return defaultTableOptions;
            }
            throw new Error(`${type} - fields is undefined`);
        }
        return options as Field[];
    }
    static EditFields(type: Table, fields: Field[]) {
        store.set(`${type}TableFields`, fields);
    }
    static EditOptions(type: Table, options: TableOptions) {
        store.set(`${type}TableOptions`, options);
    }
}

export default TableStorage;