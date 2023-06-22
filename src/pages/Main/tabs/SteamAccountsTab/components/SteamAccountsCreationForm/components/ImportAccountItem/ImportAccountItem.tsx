import React, { useState } from "react";
import TableProxyInterface from "../../../../../../../../../electron/interfaces/Proxy/TableProxyInterface";
import SmaFileInterface from "../../../../../../../../../electron/interfaces/SteamAccount/SmaFileInterface";
import MaFile from "../../../../../../../../globalComponents/MaFile/MaFile";
import "./ImportAccountItem.css";
import ProxyItem from "./ProxyItem";
import store from "../../../../../../../../store/store";
import { observer } from "mobx-react";
import Button from "../../../../../../../../globalComponents/Button/Button";

const ImportAccountItem = observer(
  (props: {
    smaFile: SmaFileInterface;
    proxyId: string | null;
    tempId: string;
  }) => {
    const content = store.steamAccountsTable.creationForm.getContent();
    const { smaFile, proxyId, tempId } = props;
    const [isMaFileOpen, setIsMaFileOpen] = useState(false);
    const [isProxyOpen, setIsProxyOpen] = useState(false);
    const [activeProxy, setActiveProxy] = useState<TableProxyInterface | null>(
      null
    );
    const [isSessionOpen, setIsSessionOpen] = useState(false);

    console.log(Object.keys(smaFile.maFile));
    return (
      <div className="imported-steam-account-item__container">
        <div className="imported-steam-account-item text-white-medium">
          <div className="imported-steam-account-cell imported-steam-account-avatar-container">
            <img
              src={smaFile.secondary.avatarUrl}
              className="imported-steam-account-avatar"
              style={{ backgroundColor: "black" }}
            ></img>
          </div>
          <div className="imported-steam-account-cell">
            {smaFile.accountName}
          </div>
          <div className="imported-steam-account-cell">
            {smaFile.secondary.nickname}
          </div>
          <div className="imported-steam-account-cell" style={{marginRight: '10px'}}>
            <button
              style={{
                marginTop: "15px",
                marginRight: "5px",
              }}
              className="proxy-item-button-expand"
              onClick={() => {
                setIsProxyOpen((isOpen) => !isOpen);
                setActiveProxy(null);
                setIsMaFileOpen(false);
              }}
            >
              <img src="./assets/img/AddNewAccount.svg"></img>
            </button>
            {activeProxy
              ? `#${proxyId} ${activeProxy.host} : ${activeProxy.port}`
              : ""}
          </div>
          <div className="imported-steam-account-cell-button">
            <button
              onClick={() => {
                setIsProxyOpen(false);
                setIsMaFileOpen((isOpen) => !isOpen);
              }}
              className="imported-steam-account-button text-white-medium"
            >
              Посмотреть
              <img
                src="./assets/img/ArrowDown.svg"
                style={{
                  marginLeft: "10px",
                  transform: isMaFileOpen ? "rotate(180deg)" : "",
                }}
              ></img>
            </button>
          </div>
          <div className="imported-steam-account-cell-button" style={{width:'50px'}}>
            <Button
              size="tiny"
              img="./assets/img/Trash.svg"
              view="icon"
              color="grey"
              hoverColor="light-grey"
              onClick={()=>{
                const index = content.importedAccounts.findIndex(sa=>sa.tempId===tempId);
                if (index >= 0){
                  content.importedAccounts = [...content.importedAccounts.slice(0, index), ...content.importedAccounts.slice(index + 1, content.importedAccounts.length)];
                  store.steamAccountsTable.creationForm.editContent({
                    importedAccounts: [...content.importedAccounts],
                  });
                }
                console.log(index);
              }}
            />
          </div>
        </div>
        {isMaFileOpen ? <MaFile maFile={smaFile.maFile}></MaFile> : <></>}
        {isProxyOpen ? (
          <ProxyItem
            onSelect={(newProxy) => {
              console.log(newProxy);
              for (var i in content.importedAccounts) {
                if (content.importedAccounts[i].tempId === tempId)
                  content.importedAccounts[i].proxyId = newProxy.id;
              }
              store.steamAccountsTable.creationForm.editContent({
                importedAccounts: [...content.importedAccounts],
              });
              setActiveProxy(newProxy);
              setIsProxyOpen(false);
            }}
          />
        ) : (
          <></>
        )}
      </div>
    );
  }
);

export default ImportAccountItem;
