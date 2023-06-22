import react, { FC, useEffect, useState } from "react";
import "./CreateProxyBlock.css";
import Delimeter from "../../../../../../../globalComponents/Delimeter/Delimeter";
import parseProxyString from "../../../../ProxiesTab/components/Funcs/parseProxyString";
import store from "../../../../../../../store/store";
import { observer } from 'mobx-react';
import ProxySetupInterface from "../../../../../../../../electron/interfaces/Proxy/ProxySetupInterface";
import Button from "../../../../../../../globalComponents/Button/Button";

export const CreateProxyBlock: FC<{
  proxy: ProxySetupInterface,
  onChange: (newProxy: ProxySetupInterface) => void
}> = observer(({ proxy, onChange }) => {
  const [isProxyFilledData, setIsProxyFilledData] = useState(false);
  const [proxyStr, setProxyStr] = useState(``);

  useEffect(() => {
    if (proxy.username != '' || proxy.password != '' || proxy.host != '' || proxy.port != '') { setIsProxyFilledData(true) }
    else { setIsProxyFilledData(false) }
  }, [proxy])

  return (
    <div className="proxy__container">
      <div className="proxy-create__container__creation">
        <input
          className="proxy-create-input text-grey-medium"
          placeholder="Начните вводить..."
          value={proxyStr}
          onChange={(e) => {
            const value = e.target.value;
            const proxyData = parseProxyString(value);
            setProxyStr(value);
            console.log(value);
            console.log(proxyData);
            onChange(proxyData);
          }}
        ></input>
        <div className="proxy-data-example text-grey-medium">
          Пример: Login:Password@1.1.1.1:77777
        </div>

      </div>
      {isProxyFilledData ?
        <div className="proxy-table__container__creation">
          <Delimeter marginTop="26px" marginBottom="15px"></Delimeter>
          <div className="proxy-table">
            <div className="proxy-table-header text-grey-medium">
              <div className="proxy-table-header-cell">Хост</div>
              <div className="proxy-table-header-cell">Порт</div>
              <div className="proxy-table-header-cell">Логин</div>
              <div className="proxy-table-header-cell">Пароль</div>
              <div className="proxy-table-header-cell">test</div>
            </div>
            <div className="proxy-item__container">
              <div className="proxy-item text-white-medium">
                <div className="proxy-item-row">
                  <div className="proxy-item-cell">{proxy.host}</div>
                  <div className="proxy-item-cell">{proxy.port}</div>
                  <div className="proxy-item-cell">{proxy.username}</div>
                  <div className="proxy-item-cell">{proxy.password}</div>
                  <div className="proxy-item-cell"><Button onClick={() => {
                    store.proxiesTable.testEditingProxy(proxy);
                  }} style={{ margin: 'auto' }} isLoad={store.proxiesTable.isTestingEditingProxy} size="small" img="./assets/img/testProxy.svg" view="icon" color="grey" hoverColor="light-grey" /></div>
                </div>
              </div>
            </div>
          </div>
        </div> : <><br /><div className='info-block'>
          Прокси не установлен!<br />
          Вся работа с этим аккаунтом будет осуществляться с вашего текущего ip
        </div></>
      }
    </div>
  );
});

export default CreateProxyBlock;
