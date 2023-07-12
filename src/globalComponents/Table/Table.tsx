import React, { useState, useEffect, MouseEvent, useRef } from 'react';
import './Table.css'; // Import your CSS file
import Field from '../../../electron/interfaces/TableFields/Field';
import AvalibleTypes from '../../../electron/interfaces/TableFields/AvalibleFieldTypes';

export interface Cell { type: AvalibleTypes, jsx: JSX.Element };
export interface Line { cells: Cell[], deleted: boolean };
export interface TableDataInterface {
  fields: Field[],
  lines: Line[],
  isSelected?: boolean,
  onSelect?: (isChecked: boolean) => void,
  onSort?: (fieldType: AvalibleTypes, direction: 'UP' | 'DOWN') => void,
  onChangeFieldWidth?: (fieldType: AvalibleTypes, newWidth: number) => void
};

const Table: React.FC<TableDataInterface> = ({ fields, lines, onChangeFieldWidth }) => {
  const ref = useRef(null);
  const [columnWidths, setColumnWidths] = useState<number[]>([]);

  useEffect(() => {
    if (fields.length == 0) return;
    const fieldsWidth = fields.map(f => f.width).map(f => !f ? 100 : f);
    setColumnWidths(fieldsWidth); // Set initial column widths
  }, [fields]);

  const handleResize = (index: number, event: MouseEvent) => {
    event.stopPropagation();
    const startX = event.clientX;
    const startWidth = columnWidths[index];

    const doResize = (event: any) => {
      const width = startWidth - (startX - event.clientX);
      setColumnWidths(prev => {
        const copy = [...prev];
        copy[index] = width > 50 ? width : 50; // minimum column width is 50px
        return copy;
      });
    };

    const stopResize = (event: any) => {
      window.removeEventListener('mousemove', doResize);
      window.removeEventListener('mouseup', stopResize);
      if (onChangeFieldWidth) {
        const newWidth = startWidth - (startX - event.clientX);
        onChangeFieldWidth(fields[index].type, newWidth > 50 ? newWidth : 50);
      }
    };

    window.addEventListener('mousemove', doResize);
    window.addEventListener('mouseup', stopResize);
  };

  return (
    <div className="table" >
      <div className="table__wrapper" ref={ref} onWheel={(e) => {
        if (ref.current)
          (ref.current as HTMLDivElement).scrollLeft += e.deltaY;

      }}>
        <div className="table__row table__row--first">
          {fields.map((field, index) =>
            <div key={index} className="table__cell" style={{ width: columnWidths[index] }}>
              {columnWidths[index] <= (field.title.length * 10) ? "" : field.title}
              <div className="table__resize-handle" onMouseDown={(event) => handleResize(index, event)} />
            </div>
          )}
        </div>
        {lines.map((line, rowIndex) => (
          <div key={rowIndex} className="table__row">
            {line.cells.map((cell, index) => <div key={index} className="table__cell" style={{ width: columnWidths[index] }}>
              {cell.jsx}
            </div>)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Table;