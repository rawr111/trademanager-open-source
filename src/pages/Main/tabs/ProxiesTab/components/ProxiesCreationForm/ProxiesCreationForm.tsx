import react, { FC, useEffect, useState } from "react";
import { observer } from "mobx-react";
import MiniWindow from "../../../../components/MiniWindow/MiniWindow";
import store from "../../../../../../store/store";
import Delimeter from "../../../../../../globalComponents/Delimeter/Delimeter";
import Button from "../../../../../../globalComponents/Button/Button";
import ProxyItem from "../ProxyItem/ProxyItem";
import "../ProxiesEditingForm/ProxiesEditingForm";
import ProxySetupInterface from '../../../../../../../electron/interfaces/Proxy/ProxySetupInterface';
import parseProxyString from "../Funcs/parseProxyString";

const ProxiesCreationForm: FC = observer(() => {
  if (!store.proxiesTable.isCreationFormOpen) return <></>;

  return (
    <MiniWindow
      title="Создание новых прокси"
      width="1000px"
      height=""
      content={<CreationFormContent />}
      onClose={() => {
        store.proxiesTable.closeCreationForm();
      }}
    />
  );
});

export const CreationFormContent: FC = () => {
  const [proxy, setProxy] = useState<ProxySetupInterface>({
    username: "",
    password: "",
    host: "",
    port: ""
  });
  const [links, setLinks] = useState<{ steamAccountIds: string[] }>({
    steamAccountIds: []
  });

  const [isProxyFilledData, setIsProxyFilledData] = useState(false)
  useEffect(() => {
    if (proxy.username != '' || proxy.password != '' || proxy.host != '' || proxy.port != '') { setIsProxyFilledData(true) }
    else { setIsProxyFilledData(false) }
  }, [proxy])

  return (
    <div className="proxy__container">
      <div className="proxy-create__container">
        <input
          className="proxy-create-input text-grey-medium"
          placeholder="Начните вводить..."
          onChange={(e) => {
            const value = e.target.value;
            const proxyData = parseProxyString(value);
            setProxy(proxyData);
          }}
        ></input>
        <div className="proxy-data-example text-grey-medium">
          Пример: Login:Password@1.1.1.1:77777
        </div>
        <Delimeter marginTop="26px" marginBottom="15px"></Delimeter>
      </div>
      {isProxyFilledData ?
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
              {
                <ProxyItem
                  proxyData={proxy}
                  links={links}
                  setLinks={setLinks}
                ></ProxyItem>
              }
            </div>
            <Delimeter marginTop="19px" marginBottom="20px"></Delimeter>
          </div>
        </div> : <></>}
      <div className="proxy-button__container">
        <Button
          size="medium"
          text="Отменить"
          color="grey"
          hoverColor="grey"
          onClick={() => {
            store.proxiesTable.closeCreationForm();
          }}
        ></Button>
        <Button size="medium" text="Сохранить" onClick={() => {
          console.log(proxy);
          console.log(links);
          if (proxy.host && proxy.port && proxy.username && proxy.password) {
            window.Main.proxies.new(proxy, links);
            store.proxiesTable.closeCreationForm();
          } else {
            store.windows.openMiniNotification({
              type: "error",
              text: "Не все поля прокси заданы!"
            });
          }
        }}></Button>
      </div>
    </div>
  );
};


export default ProxiesCreationForm;
