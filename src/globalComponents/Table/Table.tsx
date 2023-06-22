import React, { FC, useContext } from 'react';
import { observer } from 'mobx-react';
import Field from '../../../electron/interfaces/TableFields/Field';
import AvalibleTypes from '../../../electron/interfaces/TableFields/AvalibleFieldTypes';
import './Table.css';
import Context from './Context';
import getField from './Fields/getField';

export interface Cell { type: AvalibleTypes, jsx: JSX.Element };
export interface Line { cells: Cell[], deleted: boolean };
export interface TableDataInterface {
    fields: Field[],
    lines: Line[],
    isSelected?: boolean,
    onSelect?: (isChecked: boolean) => void,
    onSort?: (fieldType: AvalibleTypes, direction: 'UP' | 'DOWN') => void
};

const Table: FC<TableDataInterface> = (props) => {
    const { fields, lines } = props;

    return (
        <Context.Provider value={props}>
            <div className="list-container">
                <div className="list-content">
                    <div className="list">
                        <div className="list-headline-row">
                            {
                                fields.filter(f => f.isVisible).map((field) => getField(field))
                            }
                        </div>
                        {
                            lines.map((line, index) => {
                                return <Element key={index} line={line} />
                            })
                        }
                    </div>
                </div>
            </div>
        </Context.Provider>
    );
};

const Element: FC<{ line: Line }> = observer((props) => {
    const tableProps = useContext(Context);
    if (!tableProps) return <></>;

    const getFixedSize = (type: AvalibleTypes) => {
        if ([AvalibleTypes.checkbox, AvalibleTypes.deleteButton, AvalibleTypes.editingButton, AvalibleTypes.exportButton, AvalibleTypes.testProxyButton].includes(type)) {
            return '50px';
        }
        return '';
    }

    return (
        <div className="list-item-row" style={{
            background: props.line.deleted ? 'repeating-linear-gradient(-60deg, #555 0, #555 1px, transparent 1px, transparent 5px)' : ''
        }}>
            {
                tableProps.fields.filter(f=>f.isVisible).map((field, index) => {
                    const cell = props.line.cells.find(cell => cell.type === field.type);
                    if (!cell) return <></>;
                    return <div className='list-item' style={{ width: getFixedSize(field.type) }} key={index}>{
                        cell ? <>{cell.jsx}</> : <></>
                    }</div>
                })
            }
        </div>
    )
});

export default Table;