import react, { FC, useEffect, useState } from "react";
import MiniWindow from "../../../../components/MiniWindow/MiniWindow";
import store from "../../../../../../store/store";
import "./ProxiesEditingForm.css";
import Delimeter from "../../../../../../globalComponents/Delimeter/Delimeter";
import ProxyItem from "../ProxyItem/ProxyItem";
import Button from "../../../../../../globalComponents/Button/Button";
import { observer } from 'mobx-react';
import ProxySetupInterface from "../../../../../../../electron/interfaces/Proxy/ProxySetupInterface";
import parseProxyString from "../Funcs/parseProxyString";

const ProxiesEditingForm: FC = observer(() => {
  if (!store.proxiesTable.isEditingFormOpen) return <></>;
  const proxy = store.proxiesTable.getEditingFormContent();

  return (
    <MiniWindow
      title={`Изменить прокси (#${proxy.number}) ${proxy.host}:${proxy.port}`}
      width="1000px"
      height=""
      content={
        <EditingFormContent />
      }
      onClose={() => {
        store.proxiesTable.closeEditingForm();
      }}
    />
  );
});

const EditingFormContent: FC = observer(() => {
  const proxy = store.proxiesTable.getEditingFormContent();
  const [proxyData, setProxyData] = useState<ProxySetupInterface>({
    username: proxy.username,
    password: proxy.password,
    host: proxy.host,
    port: proxy.port
  });

  const [links, setLinks] = useState<{ steamAccountIds: string[] }>({
    steamAccountIds: proxy.steamAccountIds
  });

  const parseAddProxyArea = (value: string) => {
    const proxySetup: ProxySetupInterface = parseProxyString(value);

    setProxyData(proxySetup);
  }

  return (
    <div className="proxy__container">
      <div className="proxy-create__container">
        <input
          className="proxy-create-input text-grey-medium"
          placeholder="Начните вводить..."
          defaultValue={
            proxyData.username +
            ":" +
            proxyData.password +
            "@" +
            proxyData.host +
            ":" +
            proxyData.port
          }
          onChange={(e) => parseAddProxyArea(e.target.value)}
        ></input>
        <div className="proxy-data-example text-grey-medium">
          Пример: Login:Password@1.1.1.1:77777
        </div>
        <Delimeter marginTop="26px" marginBottom="27px"></Delimeter>
      </div>
      <div className="proxy-table__container">
        <div className="proxy-table">
          <div className="proxy-table-header text-grey-medium">
            <div className="proxy-table-header-cell">Хост</div>
            <div className="proxy-table-header-cell">Порт</div>
            <div className="proxy-table-header-cell">Логин</div>
            <div className="proxy-table-header-cell">Пароль</div>
            <div className="proxy-table-header-cell">Аккаунт</div>
            <div className="proxy-table-header-cell">test</div>
          </div>
          <div className="proxy-item__container">
            {<ProxyItem
              proxyData={proxyData}
              links={links}
              setLinks={setLinks}
            ></ProxyItem>}
          </div>
          <Delimeter marginTop="10px" marginBottom="20px"></Delimeter>
        </div>
      </div>
      <div className="proxy-button__container">
        <Button
          size="medium"
          text="Отменить"
          color="grey"
          hoverColor="grey"
          onClick={() => {
            store.proxiesTable.closeEditingForm();
          }}
        ></Button>
        <Button size="medium" text="Сохранить" onClick={() => {
          console.log(proxyData, links);
          if (proxyData.host && proxyData.port && proxyData.password && proxyData.host) {
            window.Main.proxies.edit(proxy.id, proxyData, links);
            store.proxiesTable.closeEditingForm();
          }
        }}></Button>
      </div>
    </div>
  );
});

export default ProxiesEditingForm;
