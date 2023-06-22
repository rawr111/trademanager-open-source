import react, { FC, useState } from "react";
import store from "../../../../../../../../store/store";
import { observer } from "mobx-react-lite";
import Navigation from "../../../../../../../../globalComponents/Navigation/Navigation";
import Button from "../../../../../../../../globalComponents/Button/Button";
import Delimeter from "../../../../../../../../globalComponents/Delimeter/Delimeter";
import Input from "../../../../../../../../globalComponents/Input/Input";
import MaFileImport from "../../../MaFileImport/MaFileImport";
import SteamGuardConnecting from "./SteamGuardConnecting/SteamGuardConnecting";
import SmaFileInterface from "../../../../../../../../../electron/interfaces/SteamAccount/SmaFileInterface";
import readFile from "../../../../../../../../globalComponents/SomeFuncs/readFile";
import { toJS } from "mobx";
import "./DataFilling.css";
import { CreationFormContent } from "../../../../../ProxiesTab/components/ProxiesCreationForm/ProxiesCreationForm";
import ImportAccountItem from "../ImportAccountItem/ImportAccountItem";
import CreateProxyBlock from "../../../ProxyBlock/CreateProxyBlock/CreateProxyBlock";
import SavedProxiesBlock from "../../../ProxyBlock/SavedProxiesBlock/SavedProxies";
import Checkbox from "../../../../../../../../globalComponents/Checkbox/Checkbox";
import uuid from "react-uuid";

const DataFillingForm: FC = observer(() => {
  const CreationFormSwitches = store.steamAccountsTable.creationForm.switches;
  const params = store.steamAccountsTable.creationForm.getContent();

  return (
    <div className="steam-accounts-creation-form">
      <div className="steam-data-form">
        <div className="caption">
          <Navigation
            buttons={[
              {
                text: "Новый аккаунт",
                id: "new",
              },
              {
                text: "Импорт аккаунтов",
                id: "import",
              },
            ]}
            selectedId={CreationFormSwitches.creationType}
            onChange={(newId: any) => {
              store.steamAccountsTable.creationForm.editSwitches({
                creationType: newId,
              });
            }}
          />
          <Button
            style={{ height: "43px" }}
            size="medium"
            disabled={
              store.steamAccountsTable.creationForm.currentProcess ===
              "creation"
            }
            text={
              store.steamAccountsTable.creationForm.switches.creationType ===
              "new"
                ? "Создать аккаунт"
                : "Импортировать"
            }
            color="grey"
            hoverColor="light-grey"
            onClick={() => {
              if (
                store.steamAccountsTable.creationForm.currentProcess ===
                "creation"
              )
                return alert("процесс уже запущен");
              if (
                store.steamAccountsTable.creationForm.switches.creationType ===
                "new"
              ) {
                if (params.accountName && params.password && params.maFile) {
                  store.steamAccountsTable.creationForm.runCreationProcess();
                } else {
                  store.windows.openMiniNotification({
                    type: "error",
                    text: "Не все данные установлены!",
                  });
                }
              } else {
                const importedAccounts = params.importedAccounts.map(
                  (account) => {
                    return {
                      links: { proxyId: account.proxyId },
                      smaFile: account.smaFile,
                    };
                  }
                );
                window.Main.steamAccounts.import(importedAccounts);
                store.steamAccountsTable.creationForm.editContent({
                  importedAccounts: [],
                });
                store.steamAccountsTable.creationForm.close();
              }
            }}
          />
        </div>
        {CreationFormSwitches.creationType === "new" ? (
          <NewSteamAccountForm />
        ) : (
          <ImportSteamAccountsForm />
        )}
      </div>
    </div>
  );
});

const ImportSteamAccountsForm: FC = observer(() => {
  const params = store.steamAccountsTable.creationForm.getContent();
  const importedAccounts = params.importedAccounts;

  return (
    <div className="import-steam-account-block">
      <Button
        text={
          importedAccounts.length === 0
            ? "Загрузить .smaFile файл"
            : `Выбрано ${importedAccounts.length} файлов: ` +
              importedAccounts
                .map((account) => account.smaFile.accountName)
                .join(", ")
        }
        size="medium"
        img="./assets/img/Download.svg"
        color="grey"
        hoverColor="light-grey"
        style={{ width: "100%" }}
        onClick={() => {
          const el = document.getElementById("smaFileImportInput");
          el?.click();
        }}
      />
      <input
        id="smaFileImportInput"
        multiple
        type="file"
        style={{ display: "none" }}
        onChange={async (event) => {
          const files = event.target.files;
          if (files) {
            const smaFiles: SmaFileInterface[] = [];
            for (var i in files) {
              if (!Number(i) && i !== "0") continue;
              const smaFile: SmaFileInterface = await readFile(files[i]);
              if (
                !smaFile.accountName ||
                !smaFile.password ||
                !smaFile.secondary
              ) {
                return store.windows.openMiniNotification({
                  type: "error",
                  text: `Неправильный smaFile!`,
                });
              }
              smaFiles.push(smaFile);
            }
            store.steamAccountsTable.creationForm.editContent({
              importedAccounts: smaFiles.map((file) => {
                return {
                  proxyId: null,
                  smaFile: file,
                  tempId: uuid(),
                };
              }),
            });
          }
        }}
      />
      <div className="imported-steam-accounts">
        {importedAccounts[0] ? (
          <div className="imported-steam-accounts_header text-grey-medium">
            <div
              className="imported-steam-accounts_header-text"
              style={{ width: "50px" }}
            ></div>
            <div className="imported-steam-accounts_header-text">Логин</div>
            <div className="imported-steam-accounts_header-text">Никнейм</div>
            <div className="imported-steam-accounts_header-text">Прокси</div>
            <div className="imported-steam-accounts_header-text">maFile</div>
            <div
              className="imported-steam-accounts_header-text"
              style={{ width: "50px" }}
            ></div>
          </div>
        ) : (
          <></>
        )}

        <div className="imported-steam-account__container">
          {importedAccounts.map((data, index) => (
            <ImportAccountItem
              key={index}
              proxyId={data.proxyId}
              tempId={data.tempId}
              smaFile={data.smaFile}
            ></ImportAccountItem>
          ))}
        </div>
      </div>
    </div>
  );
});

const NewSteamAccountForm: FC = observer(() => {
  const params = store.steamAccountsTable.creationForm.getContent();
  const switches = store.steamAccountsTable.creationForm.switches;
  const importedAccounts = params.importedAccounts;

  return (
    <>
      <div className="steam-data-block">
        <div className="steam-data-title text-white-medium">
          Введите данные от существующего Steam аккаунта:
        </div>
        <div className="steam-data-input__wrapper">
          <Input
            value={params.accountName}
            placeholder="Логин Steam"
            onChange={(newValue) => {
              store.steamAccountsTable.creationForm.editContent({
                accountName: newValue,
              });
            }}
          />
          <div className="steam-data-input__delimener"></div>
          <Input
            type="password"
            value={params.password}
            placeholder="пароль Steam"
            onChange={(newValue) => {
              store.steamAccountsTable.creationForm.editContent({
                password: newValue,
              });
            }}
          />
        </div>
        <Input
          value={params.tmApiKey}
          placeholder="Апи ключ tm (необязательно)"
          onChange={(newValue) => {
            store.steamAccountsTable.creationForm.editContent({
              tmApiKey: newValue,
            });
          }}
        />
        <Delimeter marginBottom="25px" marginTop="0px" />
      </div>
      <Delimeter marginBottom="25px" marginTop="0px" />
      <div className="steam-data-block">
        <div className="steam-data-title text-white-medium">
          Введите данные (все что здесь - необязательно):{" "}
        </div>
        <div className="steam-data-input__wrapper">
          <Input
            value={params.mail}
            placeholder="Почта"
            onChange={(newValue) => {
              store.steamAccountsTable.creationForm.editContent({
                mail: newValue,
              });
            }}
          />
          <div className="steam-data-input__delimener"></div>
          <Input
            type="password"
            value={params.mailPassword}
            placeholder="Почта пароль"
            onChange={(newValue) => {
              store.steamAccountsTable.creationForm.editContent({
                mailPassword: newValue,
              });
            }}
          />
        </div>
        <div className="steam-data-input__wrapper">
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Checkbox
              isChecked={params.useSteamCookies}
              onChange={(newValue) => {
                store.steamAccountsTable.creationForm.editContent({
                  useSteamCookies: newValue,
                });
              }}
            />
            <span style={{ lineHeight: "25px" }}>
              Использовать куки Steam в браузере (автологин)
            </span>
          </div>
        </div>
      </div>

      <Delimeter marginBottom="25px" marginTop="0px" />
      <div className="proxy-block">
        <Navigation
          buttons={[
            {
              text: "Без прокси",
              id: "noProxy",
            },
            {
              text: "Создать прокси",
              id: "newProxy",
            },
            {
              text: "Сохраненные прокси",
              id: "savedProxy",
            },
          ]}
          selectedId={switches.proxy}
          onChange={(newId: any) => {
            store.steamAccountsTable.creationForm.editSwitches({
              proxy: newId,
            });
          }}
        />
        <br />

        <div className="steam-account-creation_proxy-block">
          {<ProxyBlock />}
        </div>
      </div>
      <Delimeter marginBottom="25px" marginTop="25px" />
      <div className="guard-block">
        <Navigation
          buttons={[
            {
              text: "Подключить Guard",
              id: "new",
            },
            {
              text: "Использовать maFile",
              id: "maFile",
            },
          ]}
          selectedId={switches.guardConnectingType}
          onChange={(newId: any) => {
            store.steamAccountsTable.creationForm.editSwitches({
              guardConnectingType: newId,
            });
          }}
        />

        {switches.guardConnectingType === "new" ? (
          <SteamGuardConnecting />
        ) : (
          <MaFileImport
            currentMaFile={params.maFile}
            onChange={(newMaFile) => {
              store.steamAccountsTable.creationForm.editContent({
                maFile: newMaFile,
              });
            }}
          />
        )}
      </div>

      <Delimeter marginBottom="25px" marginTop="25px" />
    </>
  );
});

const ProxyBlock: FC = observer(() => {
  const CreationFormSwitches = store.steamAccountsTable.creationForm.switches;
  const content = store.steamAccountsTable.creationForm.getContent();

  switch (CreationFormSwitches.proxy) {
    case "noProxy":
      return (
        <div className="info-block">
          Прокси не установлен!
          <br />
          Вся работа с этим аккаунтом будет осуществляться с вашего текущего ip
        </div>
      );
    case "newProxy":
      return (
        <CreateProxyBlock
          proxy={content.proxy.new}
          onChange={(newProxyData) => {
            store.steamAccountsTable.creationForm.editContent({
              proxy: { ...content.proxy, new: newProxyData },
            });
          }}
        />
      );
    case "savedProxy":
      console.log(store.proxiesTable.getProxies());
      return (
        <SavedProxiesBlock
          proxies={store.proxiesTable.getProxies()}
          activeId={content.proxy.savedId}
          onChange={(newProxyId) => {
            store.steamAccountsTable.creationForm.editContent({
              proxy: { ...content.proxy, savedId: newProxyId },
            });
          }}
        />
      );
  }
});

export default DataFillingForm;
