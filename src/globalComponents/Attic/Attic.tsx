import react, { FC, useEffect, useState } from 'react';
import './Attic.css';
import { observer } from 'mobx-react';
import store from '../../store/store';

const Attic: FC<{
    title?: string,
    windowName: "askSomething" | "main" | "confirmations" | "auth" | "error",
    id?: string
}> = observer((props) => {
    return (
        <div className='attic'>
            <div className='attic__drag'>
                {props.title ? props.title : "Steam Trademanager"}
            </div>
            <div className='attic__buttons'>
                <img className='attic__button attic__button--minimize' src="./assets/img/Chrome-minimize.svg" alt="" onClick={() => {
                    switch (props.windowName) {
                        case "main":
                            return window.Main.window.close();
                        case "askSomething":
                            return window.AskFamilyPin.windowApi.close(props.id!);
                        case "confirmations":
                            return window.Confirmations.windowApi.close(props.id!);
                        case "auth":
                            return window.Auth.windowApi.close();
                        case "error":
                            return window.ErrorWindow.windowApi.close(props.id!);
                    }
                }} />
                <img className='attic__button attic__button--maximize' src={`./assets/img/Chrome${store.windows.isMainWindowMaximized ? "-maximize-2" : "-maximize"}.svg`} alt="" onClick={() => {
                    if (store.windows.isMainWindowMaximized) {
                        switch (props.windowName) {
                            case "main":
                                return window.Main.window.centerize();
                            case "askSomething":
                                return window.AskFamilyPin.windowApi.centerize(props.id!);
                            case "confirmations":
                                return window.Confirmations.windowApi.centerize(props.id!);
                            case "auth":
                                return window.Auth.windowApi.centerize();
                            case "error":
                                return window.ErrorWindow.windowApi.centerize(props.id!);
                        }
                    } else {
                        switch (props.windowName) {
                            case "main":
                                return window.Main.window.maximize();
                            case "askSomething":
                                return window.AskFamilyPin.windowApi.maximize(props.id!);
                            case "confirmations":
                                return window.Confirmations.windowApi.maximize(props.id!);
                            case "auth":
                                return window.Auth.windowApi.maximize();
                            case "error":
                                return window.ErrorWindow.windowApi.maximize(props.id!);
                        }
                    }
                }} />

                <img className='attic__button attic__button--close' src="./assets/img/Chrome-close.svg" alt="" onClick={() => {
                    switch (props.windowName) {
                        case "main":
                            return window.Main.window.minimize();
                        case "askSomething":
                            return window.AskFamilyPin.windowApi.minimize(props.id!);
                        case "confirmations":
                            console.log(props);
                            return window.Confirmations.windowApi.minimize(props.id!);
                        case "auth":
                            return window.Auth.windowApi.minimize();
                        case "error":
                            return window.ErrorWindow.windowApi.minimize(props.id!);
                    }
                }} />
            </div>
        </div>
    );
});

export default Attic;