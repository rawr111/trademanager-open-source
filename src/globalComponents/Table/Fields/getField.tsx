import React, { FC, useState, useContext } from 'react';
import Field from "../../../../electron/interfaces/TableFields/Field"
import AvalibleTypes from "../../../../electron/interfaces/TableFields/AvalibleFieldTypes"
import Checkbox from '../../Checkbox/Checkbox';
import BasicTextField from './BasicTextField';
import { observer } from 'mobx-react';
import { v4 as uuidv4 } from 'uuid';
import Context from '../Context';

export default (field: Field) => {
    return <div key={uuidv4()} className="list-headline list-headline-text">
        <Element field={field} />
    </div>;
}

const Element: FC<{ field: Field }> = observer(({ field }) => {
    const tableProps = useContext(Context);

    switch (field.type) {
        case AvalibleTypes.checkbox:
            return <Checkbox isChecked={tableProps?.isSelected} onChange={() => {
                console.log(tableProps?.isSelected)
                if (tableProps?.onSelect) tableProps.onSelect(!tableProps.isSelected);
            }} />
        default:
            return <BasicTextField field={field} />;
    }
});