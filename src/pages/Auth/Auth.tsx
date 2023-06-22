import react, { FC, useState, useEffect } from 'react';
import Attic from '../../globalComponents/Attic/Attic';
import Button from '../../globalComponents/Button/Button';
import Input from '../../globalComponents/Input/Input';
import './Auth.css';

const Auth: FC = () => {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");

    useEffect(()=>{
        window.Auth.authApi.getAuthData();
        window.Auth.authApi.onGetAuthData((event, data)=>{
            setLogin(data.login);
            setPassword(data.password);
        });
    }, []);

    return (
        <>
            <Attic windowName='auth' />
            <div className='auth-container'>
                <span style={{ fontSize: '22px' }}><b>Войти через аккаунт Pinkest</b></span>
                <div className='auth-inputs'>
                    <Input value={login} placeholder='Email' onChange={(newValue)=>{
                        setLogin(newValue);
                    }}/>
                    <Input type='password' value={password} placeholder='Пароль' onChange={(newValue)=>{
                        setPassword(newValue);
                    }}/>
                    <div onClick={()=>{
                        window.Auth.authApi.openLink(`https://pinkest.dev/user-account`);
                    }} className='auth-forgot-password'>
                        Забыли пароль?
                    </div>
                </div>
                <div className='auth-button-container'>
                    <Button onClick={()=>{
                        window.Auth.authApi.tryLogin({
                            login,
                            password
                        });
                    }} style={{width: '100%', marginBottom: '90px'}} text='Авторизоваться' size='large' color="gradient" hoverColor="gradient" />
                    <Button style={{width: '100%'}} text='У меня нет аккаунта' size='large' color="grey" hoverColor="light-grey" onClick={()=>{
                        window.Auth.authApi.openLink('https://pinkest.dev/user-account');
                    }} />
                </div>
            </div>
        </>
    );
}

export default Auth;