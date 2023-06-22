import "./Panel.css";
import Search from "../../../../globalComponents/Search/Search";
import store from "../../../../store/store";
import { observer } from "mobx-react";
import Button from "../../../../globalComponents/Button/Button";

const Panel = observer(() => {
  return (
    <div className="panel">
      <div className="panel-content">
        <h1 className="panel-text_main">Главная страница</h1>
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
            img="/assets/img/SettingsA.svg"
            hoverImg="/assets/img/SettingsA_hov.svg"
            className="button-default"
            onClick={() => {
              //store.windows.openTableSettings();
            }}
          />

          <Button
            view="icon"
            hoverColor="gradient"
            color="grey"
            size="large"
            img="/assets/img/Sort.svg"
            hoverImg="/assets/img/Sort_hov.svg"
            className="button-default"
          />

          <Button
            view="icon"
            hoverColor="gradient"
            color="grey"
            size="large"
            img="/assets/img/Refresh.svg"
            hoverImg="/assets/img/Refresh_hov.svg"
            className="button-default"
            onClick={()=>{
              //window.Main.profiles.refresh();
            }}
          />

          <Search onChange={(value) => {
           
          }}></Search>


          <Button
            size="large"
            img="/assets/img/Mark.svg"
            text="Добавить аккаунт"
            className="headline-button_gradient"
            onClick={() => {
              //store.windows.openProfileCreationForm();
            }}
          />

          <Button
            view="icon"
            hoverColor="light-grey"
            color="grey"
            size="large"
            img={true ? "./assets/img/Open.svg" :"/assets/img/Hide.svg"}
            
            className="button-default"
            onClick={()=>{
             
            }}
          />
        </div>
      </div>
    </div>
  );
});

export default Panel;
