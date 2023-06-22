import react, { FC, useState } from 'react';
import Attic from '../../globalComponents/Attic/Attic';
import Button from '../../globalComponents/Button/Button';

const SmsCode: FC<{ steamAccountName: string, id: string }> = (props) => {
    const [pin, setPin] = useState("");
    const { steamAccountName, id } = props;

    return (
        <div className="ask-family-pin-wrapper">
            <Attic title={steamAccountName} windowName="askSomething" id={props.id} ></Attic>
            <div className="ask-family-pin-container">
                <div className="">
                    <span className="text-white-large">Введите код из смс:</span>
                    <input
                        type="text"
                        className="ask-family-pin-input text-white-medium"
                        value={pin}
                        onChange={(event) => {
                            const value = event.target.value;
                            if (pin.length >= 5 && value.length >= 5) return;
                            setPin(value);
                        }}
                    ></input>
                </div>
                <Button
                    size="medium"
                    color="grey"
                    hoverColor="grey"
                    text="Подтвердить"
                    onClick={() => {
                        window.AskFamilyPin.askFamilyPinApi.sendData(id, pin);
                    }}
                ></Button>
            </div>
        </div>
    );
}

export default SmsCode;