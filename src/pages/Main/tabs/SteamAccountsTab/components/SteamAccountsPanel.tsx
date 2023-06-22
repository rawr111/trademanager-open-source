import '../../../../../css/Panel.css';
import Button from "../../../../../globalComponents/Button/Button";
import Search from "../../../../../globalComponents/Search/Search";
import { observer } from 'mobx-react';
import store from '../../../../../store/store';

const ProxiesPanel = observer(() => {
    return (
        <div className="panel">
            <div className="panel-content">
                <h1 className="panel-text_main">Steam аккаунты</h1>
                <div className="panel-content__options">
                    {/* <div className="header-content__buttons-container">
            <div className="button-default" id="panel_settings" onClick={()=>{
              store.openTableSettings();
            }}></div>
            <div className="button-default" id="panel_refresh"></div>
          </div> */}

                    <Button
                        view="icon"
                        hoverColor="gradient"
                        color="grey"
                        size="large"
                        img="./assets/img/Folder.png"
                        hoverImg="./assets/img/FolderHov.png"
                        className="button-default"
                        onClick={() => {
                            window.Main.window.openAppdata();
                        }}
                        altText="Открыть папку с данными от аккаунтов. Все данные хранятся в файле config.json"
                    />
                    <Button
                        view="icon"
                        hoverColor="gradient"
                        color="grey"
                        size="large"
                        img="./assets/img/SettingsA.svg"
                        hoverImg="./assets/img/SettingsA_hov.svg"
                        className="button-default"
                        onClick={() => {
                            store.steamAccountsTable.settingsForm.open();
                        }}
                        altText="Настройки таблицы"
                    />

                    <Button
                        view="icon"
                        hoverColor="gradient"
                        color="grey"
                        size="large"
                        img="./assets/img/Refresh.svg"
                        hoverImg="./assets/img/Refresh_hov.svg"
                        className="button-default"
                        onClick={() => {
                            console.log('send refresh req')
                            window.Main.steamAccounts.refresh();
                        }}
                        altText="Перезагрузить все данные"
                    />

                    <Search onChange={(value) => {
                        console.log(value);
                        store.steamAccountsTable.search(value);
                    }}></Search>


                    <Button
                        size="large"
                        img="./assets/img/Mark.svg"
                        text="Добавить аккаунт"
                        className="headline-button_gradient"
                        onClick={() => {
                            store.steamAccountsTable.creationForm.open();
                        }}
                    />

                    <Button
                        view="icon"
                        hoverColor="light-grey"
                        color="grey"
                        size="large"
                        img={store.steamAccountsTable.showDeleted ? "./assets/img/Open.svg" : "./assets/img/Hide.svg"}

                        className="button-default"
                        onClick={() => {
                            if (store.steamAccountsTable.showDeleted)
                                for (var i = store.steamAccountsTable.activePage; i >= 1; i--) {
                                    const steamAccountsInPage = store.steamAccountsTable.getSteamAccountsByPages()[i - 1];
                                    if (steamAccountsInPage && (steamAccountsInPage.filter(sa => sa.deleted).length != steamAccountsInPage.length)) {
                                        store.steamAccountsTable.setActivePage(i);
                                        break;
                                    }
                                }

                            store.steamAccountsTable.changeShowStatus();
                        }}
                    />
                </div>
            </div>
        </div>
    );
});

export default ProxiesPanel;
