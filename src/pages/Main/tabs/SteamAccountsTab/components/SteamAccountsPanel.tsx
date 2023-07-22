import '../../../../../css/Panel.css';
import Button from "../../../../../globalComponents/Button/Button";
import Search from "../../../../../globalComponents/Search/Search";
import { observer } from 'mobx-react';
import store from '../../../../../store/store';

const ProxiesPanel = observer(() => {
    return (
        <div className="panel">
            <div className="panel__content">
                <h1 className="panel__title">Steam аккаунты</h1>
                <div className="panel__buttons">
                    {/* <div className="header-content__buttons-container">
            <div className="button-default" id="panel_settings" onClick={()=>{
              store.openTableSettings();
            }}></div>
            <div className="button-default" id="panel_refresh"></div>
          </div> */}
                    {/* <Button
                    view="icon"
                    hoverColor="gradient"
                    color="grey"
                    size="large"
                    img="./assets/img/Shield.png"
                    hoverImg="./assets/img/ShieldHov.png"
                    className="button-default"
                    onClick={() => {
                        store.windows.prompt({
                            text: "Введите старый ключ шифрования. Если устанавливаете ключ в первый раз, то оставьте поле пустым",
                            title: "Установить ключ шифрования",
                            isInput: true,
                            type: "question",
                            cb: (text) => {
                                window.Main.window.setSecretKey(text);
                            }
                        })
                    }}
                    altText="Установить код шифрования. Ваши данные будут шифроваться"
                /> */}
                    <Search onChange={(value) => {
                        console.log(value);
                        store.steamAccountsTable.search(value);
                    }}></Search>
                    <Button
                        view="icon"
                        hoverColor="gradient"
                        color="grey"
                        size="large"
                        img="./assets/img/Table-panel-folder.svg"
                        hoverImg="./assets/img/Table-panel-folder-hov.svg"
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
                        img="./assets/img/Table-panel-settings.svg"
                        hoverImg="./assets/img/Table-panel-settings-hov.svg"
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
                        img="./assets/img/Table-panel-refresh.svg"
                        hoverImg="./assets/img/Table-panel-refresh-hov.svg"
                        className="button-default"
                        onClick={() => {
                            console.log('send refresh req')
                            window.Main.steamAccounts.refresh();
                        }}
                        altText="Перезагрузить все данные"
                    />

                    <Button
                        size="large"
                        img="./assets/img/Table-panel-button-add.svg"
                        text="Добавить аккаунт"
                        className="headline-button_gradient"
                        onClick={() => {
                            store.steamAccountsTable.creationForm.open();
                        }}
                    />
                </div>
            </div>
        </div>
    );
});

export default ProxiesPanel;
