import react, { FC } from 'react';
import { observer } from 'mobx-react';
import MiniWindow from '../../../../components/MiniWindow/MiniWindow';
import store from '../../../../../../store/store';
import './steamAccountsCreationForm.css';
import './SteamDataForm.css';
import DataFillingForm from './components/DataFilling/DataFilling';
import AccountCreation from './components/AccountCreation/AccountCreation';
import GuardSetup from './components/GuardSetup/GuardSetup';

const SteamAccountsCreationForm: FC = observer(() => {
    if (!store.steamAccountsTable.creationForm.isOpen) return <></>;

    const getCurrentContent = () => {
        switch (store.steamAccountsTable.creationForm.currentProcess) {
            case "dataFilling":
                return <DataFillingForm />
            case "creation":
                return <AccountCreation />
            case "guardConnecting":
                return <GuardSetup />;
        }
    }

    return (
        <MiniWindow
            title='Подключение нового аккаунта Steam'
            width='800px'
            height=''
            maxHeight='900px'
            content={getCurrentContent()}
            onClose={() => { store.steamAccountsTable.creationForm.close() }}
        />
    );
});

export default SteamAccountsCreationForm;