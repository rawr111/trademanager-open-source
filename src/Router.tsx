import React, { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./pages/Main/Main";
import AskFamilyPin from "./pages/AskSomething/AskSomething";
import Confirmations from "./pages/Confirmations/Confirmations";
import { observer } from 'mobx-react';
import Error from './pages/Error/Error';

const Router: FC = observer(() => {
    const root = document.getElementById('root');

    switch (window.getWindowName()) {
        case "confirmations":
            return <Confirmations />;
        case "askFamilyPin":
            return <AskFamilyPin />;
        case "main":
            return <Main />;
        case "error":
            root!.style.borderRadius = '20px';
            return <Error />
        default:
            return <>no element</>;
    }
});


export default Router;