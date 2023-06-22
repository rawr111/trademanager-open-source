import react, { FC, useContext } from 'react';
import CheckboxMini from '../../Checkbox/Checkbox';
import Context from '../Context';

const Checkbox: FC<any> = (props) => {
    const tableProps = useContext(Context);

    return (
        <CheckboxMini
            isChecked={tableProps?.isSelected}
            onChange={(isChecked) => {
                if (tableProps && tableProps.onSelect) {
                    tableProps.onSelect(isChecked);
                }
            }}
        />
    );
}

export default Checkbox;