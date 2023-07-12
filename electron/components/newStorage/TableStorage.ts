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

class TableStorage {
    static GetFields(type: 'steamAccounts' | 'proxies'): Field[] {
        try {
            const fields = store.get(`${type}TableFields`) as Field[];

            if (!fields || !fields[0].width || fields.length != defaultSteamAccountTableFields.length) {
                const fieldsToSave = type == "steamAccounts" ? defaultSteamAccountTableFields : defaultProxyTableFields;
                store.set(`${type}TableFields`, fieldsToSave);
                return fieldsToSave;
            }

            return fields;
        } catch (err) {
            throw new Error(`Error in get fields. ${err}`);
        }
    }

    static GetOptions(type: 'steamAccounts' | 'proxies') {
        try {
            const options = store.get(`${type}TableOptions`);
            if (!options) {
                store.set(`${type}TableOptions`, defaultTableOptions);
                return defaultTableOptions;
            }
            return options as Field[];
        } catch (err) {
            throw new Error(`Error in get options. ${err}`);
        }
    }

    static EditFields(type: 'steamAccounts' | 'proxies', fields: Field[]) {
        store.set(`${type}TableFields`, fields);
    }

    static EditOptions(type: 'steamAccounts' | 'proxies', options: TableOptions) {
        store.set(`${type}TableOptions`, options);
    }
}

export default TableStorage;