import react, { FC } from 'react';
import './prompt.css';
import store from '../../store/store';
import { observer } from 'mobx-react';
import Button from '../Button/Button';
import Input from '../Input/Input';

const Notification: FC = observer(() => {
    if (!store.windows.isPromptOpen) return <></>;

    const cancelButtonText = store.windows.promptContent.cancelButtonText ? store.windows.promptContent.cancelButtonText : "Отмена";
    const acceptButtonText = store.windows.promptContent.acceptButtonText ? store.windows.promptContent.acceptButtonText : "Принять";

    return (
        <div className='darkBackground' onClick={(event) => {
            const target = event.target as HTMLDivElement;
            if (target.className == 'darkBackground') store.windows.closeNotification();
        }}>
            <div className='notification'>
                <div className='notification_content'>
                    <img src={`./assets/img/${store.windows.promptContent.type}.svg`} alt="" />
                    <h3 className='notification_title'>{store.windows.promptContent.title}</h3>
                    <div className='notification_text'>{store.windows.promptContent.text}</div>
                    <div className='notification__buttons'>
                        {store.windows.promptContent.isInput === true ? <>
                            <Input value='af' onChange={()=>{

                            }} />
                            <Button color='gradient' size='large' isNonGuardButton={false} text={"Подтвердить"} onClick={() => {
                               
                            }} />
                        </> : <>
                            <Button color='grey' hoverColor='light-grey' size='large' isNonGuardButton={false} text={cancelButtonText} onClick={() => {
                                store.windows.closeNotification();
                            }} />
                            <div style={{ width: '20px' }}></div>
                            <Button color='gradient' size='large' isNonGuardButton={false} text={acceptButtonText} onClick={() => {
                                if (store.windows.promptContent.cb) store.windows.promptContent.cb();
                                store.windows.closeNotification();
                            }} />
                        </>}
                    </div>
                </div>
            </div>
        </div>
    );
});

export default Notification;