import React, { FC, useState } from "react";
import Button from "../../../../../../../../../globalComponents/Button/Button";
import Input from "../../../../../../../../../globalComponents/Input/Input";
import "./SteamGuardConnecting.css";
import store from "../../../../../../../../../store/store";
import { observer } from 'mobx-react';

const SteamDataCode: FC = observer(() => {
  const [currentPage, setCurrentPage] = useState('start');

  const StartPage: FC = observer(() => {
    return (
      <>
        <h1>Хотите подключить steam guard? Вы должны убедиться, что указанный аккаунт НЕ подключен к steam guard</h1>
        <br />
        <Button size="medium" text="Подключить" isNonGuardButton={false} onClick={() => {
          setCurrentPage('accept');
        }} />
      </>
    );
  });

  const AcceptConnectingPage: FC = observer(() => {
    const params = store.steamAccountsTable.creationForm.getContent();

    return (
      <>
        <h1>Проверьте данные:</h1><br />
        <div>Логин Steam: {params.accountName ? params.accountName : "не установлено"}</div>
        <div>Пароль Steam: {params.password ? params.password : "не установлено"}</div>
        <br />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button text="Назад" size="medium" color="grey" isNonGuardButton={false} hoverColor='light-grey' style={{ marginRight: '20px' }} onClick={() => {
            setCurrentPage('start');
          }}></Button>
          <Button disabled={!(params.accountName && params.password)} isNonGuardButton={false} text="Подключить" size="medium" onClick={() => {
            store.steamAccountsTable.creationForm.runGuardSetupProcess();
          }}></Button>
        </div>
      </>
    );
  });

  return (
    <div className="steam-data-code">
      <div className="steam-data-code__container">
        {currentPage === 'start' ? <StartPage /> : <AcceptConnectingPage />}
      </div>
    </div>
  );
});

export default SteamDataCode;