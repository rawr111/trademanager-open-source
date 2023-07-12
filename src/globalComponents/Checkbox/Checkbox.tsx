import react, { FC, useState } from 'react';
import './Checkbox.css';

const Checkbox: FC<{ isChecked?: boolean | null | undefined, onChange: (isChecked: boolean) => void, disabled?: boolean }> = (props) => {

    return (
        <div
            className={`checkbox ${props.isChecked ? "checkbox--checked" : ""}`}
            onClick={() => {
                if (props.disabled) return;
                props.onChange(!props.isChecked);
            }}>
            <img src={props.isChecked ? "./assets/img/Table-checkbox-hov.svg" : "./assets/img/Table-checkbox.svg"} alt="" />
        </div>
    );
}

export default Checkbox;