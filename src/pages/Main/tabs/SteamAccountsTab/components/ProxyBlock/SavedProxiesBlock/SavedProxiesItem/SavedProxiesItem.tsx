import React, { useState, FC } from "react";
import ProxyInterface from "../../../../../../../../../electron/interfaces/Proxy/ProxyInterface";
import TableProxyInterface from "../../../../../../../../../electron/interfaces/Proxy/TableProxyInterface";
import "./SavedProxiesItem.css";
import store from "../../../../../../../../store/store";

const SavedProxiesItem: FC<{
  proxy: TableProxyInterface,
  isActive: boolean,
  onClick: (proxyId: string) => void
}> = ({ proxy, isActive, onClick }) => {
  return (
    <div className="saved-proxies-item-container">
      <div className="saved-proxies-item-wrapper text-white-medium">
        <div className="saved-proxies-item-cell" style={{width:'50px'}}>{proxy.number}</div>
        <div className="saved-proxies-item-cell">{proxy.host}</div>
        <div className="saved-proxies-item-cell">{proxy.port}</div>
        <div className="saved-proxies-item-cell proxy-account-item-container">
          {proxy.steamAccounts.map((account) => {
            return <div className="proxy-account-item">{account.number}</div>
          })}
        </div>
      </div>
      <div className="saved-proxies-item-wrapper">
        <div
          className={isActive ? "checkbox-circle-checked" : "checkbox-circle-default"}
          onClick={
            () => {
              onClick(proxy.id);
            }
          }
        ></div>
      </div>
    </div>
  );
};

export default SavedProxiesItem;
