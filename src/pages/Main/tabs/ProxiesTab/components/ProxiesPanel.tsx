import '../../../../../css/Panel.css';
import Button from "../../../../../globalComponents/Button/Button";
import Search from "../../../../../globalComponents/Search/Search";
import { observer } from 'mobx-react';
import store from '../../../../../store/store';

const ProxiesPanel = observer(() => {
    return (
        <div className="panel">
            <div className="panel-content">
                <h1 className="panel-text_main">Прокси</h1>
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
                        img="./assets/img/SettingsA.svg"
                        hoverImg="./assets/img/SettingsA_hov.svg"
                        className="button-default"
                        onClick={() => {
                            store.proxiesTable.openTableSettings();
                        }}
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
                            window.Main.proxies.refresh();
                        }}
                    />

                    <Search onChange={(value) => {
                        store.proxiesTable.search(value);
                    }}></Search>


                    <Button
                        size="large"
                        img="./assets/img/Mark.svg"
                        text="Добавить прокси"
                        className="headline-button_gradient"
                        onClick={() => {
                            store.proxiesTable.openCreationForm();
                        }}
                    />

                    <Button
                        view="icon"
                        hoverColor="light-grey"
                        color="grey"
                        size="large"
                        img={store.proxiesTable.showDeleted ? "./assets/img/Open.svg" : "./assets/img/Hide.svg"}

                        className="button-default"
                        onClick={() => {
                            if (store.proxiesTable.showDeleted)
                                for (var i = store.proxiesTable.activePage; i >= 1; i--) {
                                    const proxiesInPage = store.proxiesTable.getProxiesByPages()[i - 1];
                                    console.log(i, proxiesInPage);
                                    if (proxiesInPage.length != 0 && (proxiesInPage.filter(p => p.deleted).length != proxiesInPage.length)) {
                                        store.proxiesTable.setActivePage(i, true);
                                        break;
                                    }
                                    if (i == 1){
                                        store.proxiesTable.setActivePage(1, true);
                                        break;
                                    }
                                }
                            store.proxiesTable.changeShowStatus();
                        }}
                    />
                </div>
            </div>
        </div>
    );
});

export default ProxiesPanel;
