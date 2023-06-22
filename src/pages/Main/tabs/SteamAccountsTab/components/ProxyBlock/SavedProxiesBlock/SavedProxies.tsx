import { FC } from "react";
import "./SavedProxies.css";
import SavedProxiesItem from "./SavedProxiesItem/SavedProxiesItem";
import Password from "../../../../../../../globalComponents/Password/Password";
import TableProxyInterface from "../../../../../../../../electron/interfaces/Proxy/TableProxyInterface";
import store from "../../../../../../../store/store";
import Button from "../../../../../../../globalComponents/Button/Button";
import { observer } from "mobx-react";

const SavedProxiesBlock: FC<{
  proxies: TableProxyInterface[],
  activeId: string | null,
  onChange: (newActiveId: string | null) => void
}> = observer(({ proxies, activeId, onChange }) => {
  const activeProxy = activeId ? proxies.filter(p => p.id === activeId)[0] : null;
  console.log(proxies, activeProxy)
  return (
    <div className="saved-proxies__container">
      <div className="saved-proxies-title text-grey-medium">
        <div className="saved-proxies-title-cell" style={{width: '50px'}}>№</div>
        <div className="saved-proxies-title-cell">Хост</div>
        <div className="saved-proxies-title-cell">Порт</div>
        <div className="saved-proxies-title-cell">Steam аккаунты</div>
      </div>
      <div className="saved-proxies">
        {proxies.map((proxy) => {
          console.log(proxy);
          if (proxy.deleted) return <></>;
          return <SavedProxiesItem
            key={proxy.id}
            proxy={proxy}
            isActive={proxy.id === activeId}
            onClick={(proxyId) => {
              if (proxyId === activeId) {
                return onChange(null);
              }
              onChange(proxyId);
            }} />
        })}
      </div>
      <div className="proxy-item__container">
        {
          activeProxy ?
            <>
              <br />
              <div style={{ lineHeight: '30px' }}>Выбранный прокси:</div>
              <br />
              <div className="proxy-table">
                <div className="proxy-table-header text-grey-medium">
                  <div className="proxy-table-header-cell" style={{width:'50px'}}>№</div>
                  <div className="proxy-table-header-cell">Хост</div>
                  <div className="proxy-table-header-cell">Порт</div>
                  <div className="proxy-table-header-cell">Логин</div>
                  <div className="proxy-table-header-cell">Пароль</div>
                  <div className="proxy-table-header-cell">test</div>
                </div>
                <div className="proxy-item__container">
                  <div className="proxy-item text-white-medium">
                    <div className="proxy-item-row">
                      <div className="proxy-item-cell" style={{width:'50px'}}>{activeProxy.number}</div>
                      <div className="proxy-item-cell">{activeProxy.host}</div>
                      <div className="proxy-item-cell">{activeProxy.port}</div>
                      <div className="proxy-item-cell"><Password style={{ height: '100%', display: 'flex', justifyContent: 'center' }} password={activeProxy.username} /></div>
                      <div className="proxy-item-cell"><Password style={{ height: '100%', display: 'flex', justifyContent: 'center' }} password={activeProxy.password} /></div>
                      <div className="proxy-item-cell"><Button onClick={() => {
                        console.log(activeProxy);
                        store.proxiesTable.testEditingProxy(activeProxy);
                      }} style={{ margin: 'auto' }} isLoad={store.proxiesTable.isTestingEditingProxy} size="small" img="./assets/img/testProxy.svg" view="icon" color="grey" hoverColor="light-grey" /></div>
                    </div>
                  </div>
                </div>
              </div>
            </>
            :
            <>
              <br />
              <div className='info-block'>
                Прокси не установлен!<br />
                Вся работа с этим аккаунтом будет осуществляться с вашего текущего ip
              </div>
            </>
        }
      </div>
    </div>
  );
});

export default SavedProxiesBlock;