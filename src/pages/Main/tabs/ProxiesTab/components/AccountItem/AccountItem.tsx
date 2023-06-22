import React from "react";
import SteamAccountInterface from "../../../../../../../electron/interfaces/SteamAccount/SteamAccountInterface";
import TableSteamAccountInterface from "../../../../../../../electron/interfaces/SteamAccount/TableSteamAccountInterface";
import Button from "../../../../../../globalComponents/Button/Button";
import Checkbox from "../../../../../../globalComponents/Checkbox/Checkbox";
import "./AccountItem.css";
import { observer } from "mobx-react";

const AccountItem = observer((props: {
  steamAccount: TableSteamAccountInterface,
  links: { steamAccountIds: string[] },
  setLinks: (links: { steamAccountIds: string[] }) => void
}) => {
  const { steamAccount, links, setLinks } = props;

  return (
    <div className="account-item">
      <div className="account-wrapper text-white-medium">
        <img
          src={steamAccount.secondary.avatarUrl}
          className="account-logo"
        ></img>
        <div className="account-item-text">
          {steamAccount.number}
        </div>
        <div className="account-item-text">
          {steamAccount.accountName}
        </div>
        <div className="account-item-text" style={{ width: '250px', display: 'flex', justifyContent: 'center' }}>
          {
            <div className='proxy-account-item text-white-medium' style={{ marginRight: '5px' }}>{steamAccount.proxy ? "#" + steamAccount.proxy.number : 'нет'}</div>
          }
          {steamAccount.proxy ? <>{steamAccount.proxy.host + ":" + steamAccount.proxy.port}</> : ""}
        </div>
      </div>
      <div className="account-wrapper">
        <div
          onClick={() => {
            if (links.steamAccountIds.includes(steamAccount.id)) {
              const index = links.steamAccountIds.findIndex(id => id === steamAccount.id);
              setLinks({ ...links, steamAccountIds: [...links.steamAccountIds.slice(0, index), ...links.steamAccountIds.slice(index + 1)] });
            } else {
              setLinks({ ...links, steamAccountIds: [...links.steamAccountIds, steamAccount.id] });
            }
          }}
          className={links.steamAccountIds.includes(steamAccount.id) ? "checkbox-checked" : "checkbox-default__proxy"}
        ></div>
      </div>
    </div>
  );
});

export default AccountItem;
