import react, { FC, useState } from 'react';
import { observer } from 'mobx-react';
import store from '../../../../../../../../store/store';
import CreationStepType from '../../../../../../../../../electron/interfaces/SteamAccount/CreationStepType';
import LoadingIcons from 'react-loading-icons'
import './AccountCreation.css';
import Button from '../../../../../../../../globalComponents/Button/Button';

const AccountCreation: FC = observer(() => {
    const Page: FC<{ step: CreationStepType }> = observer(({ step }) => {
        switch (step) {
            case "start":
                return <Step title='Запускаем процесс добавления Steam аккаунта' text='Программа залогинится по вашим данным и подгрузит всю нужную информацию. Это может занять какое-то время, не переживайте' />
            case "loginByPassword":
                return <Step title='Логинимся по имени и паролю' text='Похоже, что указанная сессия в мафайле недействительна, поэтому мы создаем новую' />
            case "checkLoginStatus":
                return <Step title='Проверяем статус текущей сессии' text='Программа узнает есть ли у нее доступ к функционалу вашего Steam аккаунта' />
            case "askPin":
                return <Step title='Введите пин код семейного доступа' text='У вас открылось окно, введите туда свой pin' />
            case "tryPin":
                return <Step title='Пытаемся установить введенный пин код' text='' />
            case "loadData":
                return <Step title='Подгружаем информацию об аккаунте' text='Аватарку, никнейм, уровень, баланс, валюту и прочее...' />
            case "link":
                return <Step title='Привязываем аккаунт к прокси и профилю' text='' />;
            case "import":
                return <Step title='Сохраняем данные аккаунта в системе' text='' />
            case "end":
                return (<div className='account-creation_step'>
                    <div className='title'>Аккаунт создан</div>
                    <div className='text'>Можно закрыть окно</div>
                </div>);
            case "error":
                return (<div className='account-creation_step'>
                    <div className='title'>Ошибка 😒</div>
                    <div className='texxt'>{store.steamAccountsTable.creationForm.creationProcessError}</div>
                </div>);
            default:
                return <>Неизвестный шаг: {step}</>;
        }
    });

    return (
        <>
            <Page step={store.steamAccountsTable.creationForm.creationProcessStep} />
        </>
    );
});

const Step: FC<{ title: string, text: string }> = (props) => {
    const { title, text } = props;

    return <div className='account-creation_step'>
        <div className='title'>{title}</div>
        <div className='text'>{text}</div>
        <LoadingIcons.BallTriangle style={{ width: '50px', height: '50px', marginBottom: '30px' }} />
        <Button size='medium' text='Прервать добавление' color='grey' hoverColor='light-grey' onClick={() => {
            store.steamAccountsTable.creationForm.close();
        }} />
    </div>
}

export default AccountCreation;