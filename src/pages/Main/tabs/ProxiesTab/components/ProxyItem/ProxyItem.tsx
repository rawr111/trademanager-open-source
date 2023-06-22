import React, { useEffect, useState } from "react";
import store from "../../../../../../store/store";
import AccountItem from "../AccountItem/AccountItem";
import ProxySetupInterface from '../../../../../../../electron/interfaces/Proxy/ProxySetupInterface';
import "./ProxyItem.css";
import { observer } from "mobx-react-lite";
import Button from "../../../../../../globalComponents/Button/Button";

const ProxyItem = observer((props: {
  proxyData: ProxySetupInterface | null,
  links: { steamAccountIds: string[] },
  setLinks: (links: { steamAccountIds: string[] }) => void
}) => {
  const { proxyData, links, setLinks } = props;

  console.log(proxyData);
  if (!proxyData) {
    console.log('return empty')
    return <></>;
  }

  useEffect(() => {
    links.steamAccountIds.length > 5 ? setOverflow(true) : setOverflow(false)
  }, [links.steamAccountIds])

  const [overflow, setOverflow] = useState(false);
  const [navigation, setNavigation] = useState<Navigation>("none");

  const steamAccounts = Object.values(store.steamAccountsTable.getSteamAccounts());

  return (
    <div className="proxy-item text-white-medium">
      <div className="proxy-item-row">
        <div className="proxy-item-cell">{proxyData.host}</div>
        <div className="proxy-item-cell">{proxyData.port}</div>
        <div className="proxy-item-cell">{proxyData.username}</div>
        <div className="proxy-item-cell">{proxyData.password}</div>
        <div
          className="proxy-item-cell icon"
          style={overflow ? { justifyContent: "flex-start" } : {}}
        >
          <button
            className="proxy-item-button-expand"
            onClick={() => {
              navigation == "accounts"
                ? setNavigation("none")
                : setNavigation("accounts");
            }}
          >
            <img src="./assets/img/AddNewAccount.svg"></img>
          </button>

          {steamAccounts.map((sa, index) => {
            return (
              links.steamAccountIds.includes(sa.id) ? <div className='proxy-account-item text-white-medium'>{sa.number}</div> : <></>
            );
          })}
        </div>
        <div className="proxy-item-cell"><Button isLoad={store.proxiesTable.isTestingEditingProxy} onClick={() => {
          store.proxiesTable.testEditingProxy(proxyData);
        }} color="grey" hoverColor="light-grey" style={{ margin: 'auto' }} view="icon" size="small" img="./assets/img/testProxy.svg" /></div>
      </div>
      {
        {
          none: <></>,
          accounts: (
            <div className="accounts__container">
              <div className="accounts-header text-grey-medium">
                <span className="account-header-text">№</span>
                <span className="account-header-text">Логин</span>
                <span className="account-header-text" style={{ width: '250px' }}>Подключенные прокси</span>
              </div>

              <div className="accounts-proxy">
                {steamAccounts.map((steamAccount, index) => {
                  if (!steamAccount.deleted)
                    return (
                      <AccountItem
                        steamAccount={steamAccount}
                        links={links}
                        setLinks={setLinks}
                        key={`accountItem${index}`}
                      ></AccountItem>
                    );
                })}
              </div>
            </div>
          )
        }[navigation]
      }
    </div>
  );
});

type Navigation = "accounts" | "none";

export default ProxyItem;
