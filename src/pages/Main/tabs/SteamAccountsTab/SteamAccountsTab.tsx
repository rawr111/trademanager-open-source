import react, { FC, useEffect } from 'react';
import { observer } from 'mobx-react';

import SteamAccountsTable from './components/SteamAccountsTable';
import SteamAccountsPanel from './components/SteamAccountsPanel';
import SteamAccountsFooter from './components/SteamAccountsFooter';
import store from '../../../../store/store';
import TableSettings from '../../../../globalComponents/TableSettings/TableSettings';
import SteamAccountsEditForm from './components/SteamAccountsEditForm/SteamAccountsEditForm';
import SteamAccountsCreationForm from './components/SteamAccountsCreationForm/SteamAccountsCreationForm';
import steamAccountsTableFields from '../../../../../electron/interfaces/TableFields/defaults/steamAccountsTableFields';
import NewTable from '../../../../globalComponents/Table/Table';
import AvalibleFieldTypes from '../../../../../electron/interfaces/TableFields/AvalibleFieldTypes';

const SteamAccountsTab: FC = observer(() => {
    return (
        <>
            <div className='main'>
                <SteamAccountsPanel />
                <SteamAccountsTable /> 
                <SteamAccountsFooter />
            </div>
            <SteamAccountsCreationForm />
            <SteamAccountsEditForm />
            <TableSettings
                isOpen={store.steamAccountsTable.settingsForm.isOpen}
                fields={steamAccountsTableFields}
                currentFields={store.steamAccountsTable.getCustomizableFields()}
                onClose={() => {
                    store.steamAccountsTable.settingsForm.close();
                }}
                onSave={(newFields) => {
                    store.steamAccountsTable.setFields(newFields);
                    store.steamAccountsTable.saveFields(newFields);
                    store.steamAccountsTable.settingsForm.close();
                }}
            />

        </>
    );
});


export default SteamAccountsTab;