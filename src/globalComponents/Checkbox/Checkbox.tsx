import react, { FC, useState } from 'react';
import './Checkbox.css';

const Checkbox: FC<{ isChecked?: boolean | null | undefined, onChange: (isChecked: boolean) => void, disabled?: boolean }> = (props) => {

    return (
        <div className={props.isChecked ? "checkbox-checked" : "checkbox-default"} style={{ cursor: props.disabled ? 'not-allowed' : 'pointer' }} onClick={() => {
            if (props.disabled) return;
            props.onChange(!props.isChecked);
        }}></div>

    );
}

export default Checkbox;