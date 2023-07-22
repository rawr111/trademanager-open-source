import { FC, useEffect } from "react";
import Table, { Line, Cell } from "../../../../../globalComponents/Table/Table";
import AvalibleTypes from "../../../../../../electron/interfaces/TableFields/AvalibleFieldTypes";
import store from "../../../../../store/store";
import Field from "../../../../../../electron/interfaces/TableFields/Field";
import Checkbox from "../../../../../globalComponents/Checkbox/Checkbox";
import Button from "../../../../../globalComponents/Button/Button";
import Password from "../../../../../globalComponents/Password/Password";
import { observer, useLocalObservable } from "mobx-react";
import TableSteamAccountInterface from "../../../../../../electron/interfaces/SteamAccount/TableSteamAccountInterface";
import convertMaFileToStr from "../../../../../../electron/components/Functions/converMaFileToStr";
import Guard from "../../../components/Guard/Guard";
import LoadingIcons from "react-loading-icons";
import ReactTooltip from "react-tooltip";
import uuid from "react-uuid";

const SteamAccountsTableWrapper: FC = () => {
  const fields = store.steamAccountsTable.getFields();
  return <SteamAccountsTable fields={fields} />
};

const SteamAccountsTable: FC<{ fields: Field[] }> = observer(({ fields }) => {
  const steamAccountsByPage = store.steamAccountsTable.getSteamAccountsByPages();
  const lines: Line[] = [];

  if (steamAccountsByPage[store.steamAccountsTable.activePage - 1])
    for (var steamAccount of steamAccountsByPage[
      store.steamAccountsTable.activePage - 1
    ]) {
      if (steamAccount.deleted && !store.steamAccountsTable.showDeleted)
        continue;
      lines.push(generateLine(fields, steamAccount));
    }

  return (
    <Table
      onChangeFieldWidth={(type, newWidth) => {
        const field = fields.find(f => f.type == type);
        if (field) {
          field.width = newWidth;
          console.log(fields);
          console.log(type, newWidth);
          window.Main.steamAccounts.saveTableFields(fields);
        }
      }}
      onSelect={(isSelected) => {
        store.steamAccountsTable.selectAllSteamAccounts(isSelected);
      }}
      isSelected={store.steamAccountsTable.isAllSelected}
      fields={fields}
      lines={lines}
      onSort={(fieldType, direction) => {
        store.steamAccountsTable.changeFieldDirection(fieldType, direction);
        switch (fieldType) {
          case AvalibleTypes.number:
            return store.steamAccountsTable.sortSteamAccounts((a, b) =>
              direction === "UP"
                ? a.number < b.number
                  ? 1
                  : -1
                : a.number > b.number
                  ? 1
                  : -1
            );
          case AvalibleTypes.steamAccountNickname:
            return store.steamAccountsTable.sortSteamAccounts((a, b) =>
              direction === "UP"
                ? a.secondary.nickname < b.secondary.nickname
                  ? 1
                  : -1
                : a.secondary.nickname > b.secondary.nickname
                  ? 1
                  : -1
            );
          case AvalibleTypes.steamAccountBalance:
            return store.steamAccountsTable.sortSteamAccounts((a, b) =>
              direction === "UP"
                ? a.changableSecondary.steam.balance! <
                  b.changableSecondary.steam.balance!
                  ? 1
                  : -1
                : a.changableSecondary.steam.balance! >
                  b.changableSecondary.steam.balance!
                  ? 1
                  : -1
            );
          case AvalibleTypes.csgoTmBalance:
            return store.steamAccountsTable.sortSteamAccounts((a, b) =>
              direction === "UP"
                ? (a.changableSecondary.market?.balance
                  ? a.changableSecondary.market?.balance
                  : 0) <
                  (b.changableSecondary.market?.balance
                    ? b.changableSecondary.market?.balance
                    : 0)
                  ? 1
                  : -1
                : (a.changableSecondary.market?.balance
                  ? a.changableSecondary.market?.balance
                  : 0) >
                  (b.changableSecondary.market?.balance
                    ? b.changableSecondary.market?.balance
                    : 0)
                  ? 1
                  : -1
            );
          case AvalibleTypes.ktState:
            return store.steamAccountsTable.sortSteamAccounts((a, b) =>
              direction === "UP"
                ? a.secondary.ktState < b.secondary.ktState
                  ? 1
                  : -1
                : a.secondary.ktState > b.secondary.ktState
                  ? 1
                  : -1
            );
          case AvalibleTypes.tpState:
            return store.steamAccountsTable.sortSteamAccounts((a, b) =>
              direction === "UP"
                ? a.secondary.tpState < b.secondary.tpState
                  ? 1
                  : -1
                : a.secondary.tpState > b.secondary.tpState
                  ? 1
                  : -1
            );
          case AvalibleTypes.tradeState:
            return store.steamAccountsTable.sortSteamAccounts((a, b) =>
              direction === "UP"
                ? a.secondary.tradeState < b.secondary.tradeState
                  ? 1
                  : -1
                : a.secondary.tradeState > b.secondary.tradeState
                  ? 1
                  : -1
            );
          case AvalibleTypes.steamAccountLevel:
            return store.steamAccountsTable.sortSteamAccounts((a, b) =>
              direction === "UP"
                ? a.secondary.level < b.secondary.level
                  ? 1
                  : -1
                : a.secondary.level > b.secondary.level
                  ? 1
                  : -1
            );
          case AvalibleTypes.steamAccountName:
            return store.steamAccountsTable.sortSteamAccounts((a, b) =>
              direction === "UP"
                ? a.accountName < b.accountName
                  ? 1
                  : -1
                : a.accountName > b.accountName
                  ? 1
                  : -1
            );
          case AvalibleTypes.steamPassword:
            return store.steamAccountsTable.sortSteamAccounts((a, b) =>
              direction === "UP"
                ? a.password < b.password
                  ? 1
                  : -1
                : a.password > b.password
                  ? 1
                  : -1
            );
        }
      }}
    ></Table>
  );
});

const generateLine = (
  fields: Field[],
  steamAccount: TableSteamAccountInterface
): Line => {
  const line: Line = { cells: [], deleted: steamAccount.deleted };

  for (var index in fields) {
    line.cells.push({
      type: fields[index].type,
      jsx: <CellJSX type={fields[index].type} steamAccount={steamAccount} />,
    });
  }
  return line;
};

export const CellJSX: FC<{
  type: AvalibleTypes;
  steamAccount: TableSteamAccountInterface;
}> = observer(({ type, steamAccount }) => {
  const changableSecondaries = store.steamAccountsTable.changableSecondaries[steamAccount.id];
  const browserStatus = store.steamAccountsTable.browserStatuses[steamAccount.id];

  switch (type) {
    case AvalibleTypes.mail:
      return <>{steamAccount.mail ? steamAccount.mail : ""}</>;
    case AvalibleTypes.mailPassword:
      return steamAccount.mailPassword ? (
        <Password password={steamAccount.mailPassword} />
      ) : (
        <>нет</>
      );
    case AvalibleTypes.profileName:
      return <>{steamAccount.profileName ? steamAccount.profileName : ""}</>;
    case AvalibleTypes.steamAccountButtons:
      return (
        <div className="steam-account-buttons">
          <Button
            disabled={steamAccount.deleted}
            size="tiny"
            color="grey"
            hoverColor="dark-pink"
            view="icon"
            img="./assets/img/Table-confirmations.svg"
            hoverImg="./assets/img/Table-confirmations-hov.svg"
            onClick={() => {
              window.Main.steamAccounts.openConfirmations({
                id: steamAccount.id,
                steamAccountName: steamAccount.accountName,
              });
            }}
            altText="Steam Guard подтверждения"
          />
          <Button
            disabled={steamAccount.deleted}
            isLoad={steamAccount.isLoadSecondary}
            size="tiny"
            color="grey"
            hoverColor="dark-pink"
            view="icon"
            img="./assets/img/Table-update.svg"
            hoverImg="./assets/img/Table-update-hov.svg"
            onClick={() => {
              store.steamAccountsTable.loadSecondaries(steamAccount.id);
            }}
            altText="Обновить данные профиля (в том числе и статусы)"
          />
          <Button
            disabled={steamAccount.deleted}
            isLoad={steamAccount.isLogining}
            size="tiny"
            color="grey"
            hoverColor="dark-pink"
            view="icon"
            img="./assets/img/Table-relogin.svg"
            hoverImg="./assets/img/Table-relogin-hov.svg"
            onClick={() => {
              store.steamAccountsTable.refreshSession(steamAccount.id);
            }}
            altText="Обновить сессию (перелогиниться)"
          />
          <Button
            disabled={steamAccount.deleted}
            size="tiny"
            color="grey"
            hoverColor="dark-pink"
            view="icon"
            img="./assets/img/Table-mafile.svg"
            hoverImg="./assets/img/Table-mafile-hov.svg"
            onClick={() => {
              const el = document.getElementById(
                `exportMaFile${steamAccount.id}`
              );
              el?.click();
            }}
            altText="Сохранить maFile как"
          />
          <a
            id={`exportMaFile${steamAccount.id}`}
            href={
              "data:text/json;charset=utf-8," +
              encodeURIComponent(
                convertMaFileToStr(steamAccount.smaFile.maFile)
              )
            }
            download={`${steamAccount.maFile.Session.SteamID}.maFile`}
          ></a>
        </div>
      );

    case AvalibleTypes.tradeState:
      if (steamAccount.deleted) return <></>;
      return steamAccount.isLoadSecondary ? <LoadingIcons.ThreeDots className="micro-download" /> : steamAccount.secondary.tradeState ? <img src="./assets/img/Status-ok.svg" alt="" /> : <img src="./assets/img/Status-no.svg" />;

    case AvalibleTypes.ktState:
      if (steamAccount.deleted) return <></>;
      return steamAccount.isLoadSecondary ? <LoadingIcons.ThreeDots className="micro-download" /> : steamAccount.secondary.ktState ? <img src="./assets/img/Status-kt.svg" /> : <img src="./assets/img/Status-ok.svg" />;

    case AvalibleTypes.tpState:
      if (steamAccount.deleted) return <></>;
      return steamAccount.isLoadSecondary ? <LoadingIcons.ThreeDots className="micro-download" /> : steamAccount.secondary.tpState ? <img src="./assets/img/Status-ok.svg" /> : <img src="./assets/img/Status-no.svg" />;

    case AvalibleTypes.csgoTmBalance:
      if (steamAccount.deleted) return <></>;
      if (changableSecondaries.isLoad) {
        const uniqueId = uuid();
        if (changableSecondaries.content.market.error) {
          return <div
            data-tip="React-tooltip"
            data-for={uniqueId}>
            Ошибка(?)
            <ReactTooltip
              place="top"
              type="dark"
              effect="float"
              id={uniqueId}
            >
              <div className="alt-text-container">
                {String(changableSecondaries.content.market.error)}
              </div>
            </ReactTooltip>
          </div>
        } else {
          return changableSecondaries.content.market ? (
            <>
              {changableSecondaries.content.market.balance}
              {changableSecondaries.content.market.currency}
            </>
          ) : (
            <>нет api</>
          );
        }
      } else {
        return <LoadingIcons.ThreeDots className="micro-download" />;
      }

    case AvalibleTypes.steamAccountBalance:
      if (steamAccount.deleted) return <></>;

      if (changableSecondaries.isLoad) {
        const uniqueId = uuid();
        if (changableSecondaries.content.steam.error) {
          return (
            <div data-tip="React-tooltip" data-for={uniqueId}>
              Ошибка(?)
              <ReactTooltip
                place="top"
                type="dark"
                effect="float"
                id={uniqueId}
              >
                <div className="alt-text-container">
                  {String(changableSecondaries.content.steam.error)}
                </div>
              </ReactTooltip>
            </div>
          );
        } else {
          return (
            <>
              {changableSecondaries.content.steam.balance}
              {changableSecondaries.content.steam.currency}
            </>
          );
        }
      } else {
        return <LoadingIcons.ThreeDots className="micro-download" />;
      }

    case AvalibleTypes.tmApiKey:
      return steamAccount.tmApiKey ? (
        <Password password={steamAccount.tmApiKey} />
      ) : (
        <>Нет</>
      );

    case AvalibleTypes.steamGuard:
      return steamAccount.deleted ? <></> : <Guard code={store.steamAccountsTable.authCodes[steamAccount.id]} />;

    case AvalibleTypes.steamAccountName:
      return <>{steamAccount.accountName}</>;

    case AvalibleTypes.steamPassword:
      return <Password password={steamAccount.password} />;

    case AvalibleTypes.steamAccountNickname:
      return steamAccount.isLoadSecondary ? <LoadingIcons.ThreeDots className="micro-download" /> : <>{steamAccount.secondary.nickname}</>;

    case AvalibleTypes.steamAccountLevel:
      return steamAccount.isLoadSecondary ? <LoadingIcons.ThreeDots className="micro-download" /> : <>{steamAccount.secondary.level}</>;

    case AvalibleTypes.steamAccountAvatar:
      return steamAccount.isLoadSecondary ?
        <div className="steam-account-avatar">
          <LoadingIcons.ThreeDots className="micro-download" />
        </div>
        :
        <img
          src={steamAccount.secondary.avatarUrl}
          className="steam-account-avatar"
          style={{ backgroundColor: "black" }}
        />;

    case AvalibleTypes.linkedProxies:
      if (steamAccount.proxy) {
        return (
          <>
            (#{steamAccount.proxy.number}) {steamAccount.proxy.host}:
            {steamAccount.proxy.port}
          </>
        );
      } else {
        return <>нет</>;
      }

    case AvalibleTypes.checkbox:
      if (steamAccount.deleted) {
        return (
          <Checkbox
            isChecked={false}
            disabled={true}
            onChange={(isChecked) => { }}
          />
        );
      }
      return (
        <Checkbox
          isChecked={steamAccount.isSelected}
          onChange={(isChecked) => {
            store.steamAccountsTable.selectSteamAccount(
              steamAccount.id,
              isChecked
            );
          }}
        />
      );

    case AvalibleTypes.number:
      return <>{steamAccount.number}</>;

    case AvalibleTypes.accountTools:
      return <div className="account-tools">
        <Button
          size="small"
          color="grey"
          hoverColor="light-grey"
          view="icon"
          img="./assets/img/Table-export.svg"
          hoverImg="./assets/img/Table-export-hov.svg"
          onClick={() => {
            const el = document.getElementById(
              `exportSmaFile${steamAccount.id}`
            );
            el?.click();
          }}
          altText="Экспорт данных аккаунта (smaFile)"
        />
        <a
          style={{ display: "none" }}
          id={`exportSmaFile${steamAccount.id}`}
          href={
            "data:text/json;charset=utf-8," +
            encodeURIComponent(JSON.stringify(steamAccount.smaFile))
          }
          download={`${steamAccount.accountName}.smaFile`}
        ></a>
        <Button
          size="small"
          color="grey"
          hoverColor="light-grey"
          view="icon"
          img="./assets/img/Table-edit.svg"
          hoverImg="./assets/img/Table-edit-hov.svg"
          onClick={() => {
            store.steamAccountsTable.editingForm.open(steamAccount);
          }}
          altText="Редактирование данных Steam аккаунта"
        />
        <Button
          size="small"
          color="grey"
          hoverColor="light-grey"
          view="icon"
          img="./assets/img/Table-delete.svg"
          hoverImg="./assets/img/Table-delete-hov.svg"
          onClick={() => {
            store.windows.prompt({
              type: "question",
              title: `Хотите отправить Steam аккаунт №${steamAccount.number} в архив?`,
              text: "Его всегда можно будет восстановить или удалить окончательно (просто кликни на глазик в верхней панели)",
              acceptButtonText: "Убрать в архив!",
              cancelButtonText: "Отмена",
              cb: () => {
                store.steamAccountsTable.editSteamAccount(steamAccount.id, {
                  deleted: true,
                });
                window.Main.steamAccounts.edit(
                  steamAccount.id,
                  { deleted: true },
                  { proxyId: null }
                );
                //window.Main.steamAccounts.get();
              },
            });
          }}
        />
      </div>;

    case AvalibleTypes.startButton:
      switch (browserStatus) {
        case "working":
          return <div className="browser-btn-wrapper">
            <div className="browser-btn browser-btn--stop"
              onClick={() => {
                window.Main.steamAccounts.stopBrowser(steamAccount.id);
              }}>STOP</div>
            <Button
              disabled={steamAccount.deleted}
              size="tiny"
              color="grey"
              hoverColor="dark-pink"
              view="icon"
              style={{ marginRight: "5px" }}
              img="./assets/img/Table-browser-to-top.svg"
              hoverImg="./assets/img/Table-browser-to-top-hov.svg"
              onClick={() => {
                window.Main.steamAccounts.focusBrowser(steamAccount.id);
              }}
              altText="Поднять браузер наверх"
            />
          </div>;

        case "notworking":
          return <div
            className="browser-btn browser-btn--start"
            onClick={() => {
              window.Main.steamAccounts.startBrowser(steamAccount.id);
            }}
          >
            START
          </div>

        default:
          return (
            <div className="browser-btn browser-btn--wait">
              <LoadingIcons.Bars
                style={{ width: "20px", height: "20px", marginTop: "3px" }}
              />
            </div>
          );
      }

    default:
      return <></>;
  }
});

export default SteamAccountsTableWrapper;
