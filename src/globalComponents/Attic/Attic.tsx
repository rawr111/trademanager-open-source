import react, { FC } from 'react';
import './Attic.css';

type WindowName = "askSomething" | "main" | "confirmations" | "auth" | "error";

const Attic: FC<AtticInterface> = (props) => {
    return (
        <>
            <div className='attic'>
                <div className='drag'>
                    {props.title ? props.title : "Pinkest.dev"}
                </div>
                <div className='buttons'>
                    <div onClick={() => {
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
                    }}></div>
                    <div onClick={() => {
                        console.log(window.innerHeight, screen.height - 40)
                        if (window.innerHeight === screen.height - 40) {
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
                    }}></div>
                    <div onClick={() => {
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
                    }}></div>
                </div>
            </div>
        </>
    );
}

interface AtticInterface {
    title?: string,
    windowName: WindowName,
    id?: string
}

export default Attic;