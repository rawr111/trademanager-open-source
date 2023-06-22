import react, { FC } from 'react';
import MiniWindow from '../MiniWindow/MiniWindow';
import store from '../../../../store/store';
import './MyProfile.css';
import { observer } from 'mobx-react';
import Button from '../../../../globalComponents/Button/Button';

const MyProfile: FC = observer(() => {
    if (!store.windows.isMyProfileOpen) return <></>;

    return (
        <MiniWindow title='Данные профиля' width='500px' height='250px' content={<MyProfileContent />} onClose={() => {
            store.windows.closeMyProfile();
        }} />
    );
});

const MyProfileContent: FC = () => {
    return <div className='myProfile-container'>
        Имя пользователя: {store.windows.profileData.email}, <br />
        <div>
            <Button text='Выйти' color='grey' hoverColor='light-grey' size='large' onClick={()=>{
                window.Main.window.exit();
            }} />
        </div>
    </div>;
}

export default MyProfile;