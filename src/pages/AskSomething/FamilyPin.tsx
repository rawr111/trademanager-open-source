import react, { FC, useState } from 'react';
import Attic from '../../globalComponents/Attic/Attic';
import Button from '../../globalComponents/Button/Button';

const FamilyPin: FC<{ steamAccountName: string, id: string }> = (props) => {
    const [pin, setPin] = useState("");
    const { steamAccountName, id } = props;

    return (
        <div className="ask-family-pin-wrapper">
            <Attic title={steamAccountName} id={props.id} windowName="askSomething"></Attic>
            <div className="ask-family-pin-container">
                <div className="">
                    <span className="text-white-large">Введите пин код:</span>
                    <input
                        type="text"
                        className="ask-family-pin-input text-white-medium"
                        value={pin}
                        onChange={(event) => {
                            const value = event.target.value;
                            if (pin.length >= 4 && value.length >= 4) return;
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

export default FamilyPin;