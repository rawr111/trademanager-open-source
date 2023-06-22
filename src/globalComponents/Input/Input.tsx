import react, { FC, useState } from 'react';
import { observer } from 'mobx-react';
import './input.css';

const Input: FC<{ value: string, type?: react.HTMLInputTypeAttribute, style?: React.CSSProperties, onChange?: (newValue: string) => void, placeholder?: string, readonly?: boolean }> = observer((props) => {
    const [inputType, setInputType] = useState(props.type)
    return (
        <div className='input-container'>
        <input
            type={inputType ? inputType : 'text'}
            className="input-text text-grey-medium"
            placeholder={props.placeholder ? props.placeholder : ""}
            value={props.value}
            style={props.style}
            onChange={(event) => {
                const text = event.target.value;
                if (props.onChange) props.onChange(text);
            }}
            readOnly={props.readonly ? true : false}
        ></input>
        {props.type == 'password' ? <img src={inputType == 'text' ? "./assets/img/Password_show.svg" :  "./assets/img/Password_hide.svg"} onClick={()=>{inputType == "text" ? setInputType('password') : setInputType('text')}} className='input-eye'></img>: <></>}
        </div>
    );
});

export default Input;