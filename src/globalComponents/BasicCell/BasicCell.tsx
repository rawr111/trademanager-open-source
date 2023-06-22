import { FC, useRef, createRef } from 'react';
import './BasicCell.css';
import { observer  } from 'mobx-react';

const BasicCell: FC<{ startValue?: string, onChange: (value: string) => void, isPassword?: boolean, isEditing?: boolean, deleted?: boolean }> = observer((props) => {
    const { deleted, isEditing, isPassword, startValue, onChange } = props;

    const input = useRef<HTMLInputElement>(null);

    return (
        <input 
            autoFocus
            disabled={!isEditing}
            ref={input}
            style={{
                textDecoration: deleted ? 'line-through' : 'none'
            }}
            className={`basic-cell_input ${isEditing ? "editing-cell_input" : ""}`}
            type={isPassword && !isEditing ? "password" : "text"}
            defaultValue={startValue ? startValue : ""}
            onChange={(event) => {
                const target = event.target;
                onChange(target.value);
                //input.current?.focus();
            }}
        />
    );
});

export default BasicCell;