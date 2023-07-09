import React, { useState, useEffect, MouseEvent } from 'react';
import './NewTable.css'; // Import your CSS file
import Field from '../../../electron/interfaces/TableFields/Field';
import AvalibleTypes from '../../../electron/interfaces/TableFields/AvalibleFieldTypes';

interface ResizableTableProps {
  columns: string[];
  data: string[][];
}
export interface Cell { type: AvalibleTypes, jsx: JSX.Element };
export interface Line { cells: Cell[], deleted: boolean };
export interface TableDataInterface {
  fields: Field[],
  lines: Line[],
  isSelected?: boolean,
  onSelect?: (isChecked: boolean) => void,
  onSort?: (fieldType: AvalibleTypes, direction: 'UP' | 'DOWN') => void
};

const ResizableTable: React.FC<TableDataInterface> = ({ fields, lines }) => {
  const [columnWidths, setColumnWidths] = useState<number[]>([]);
  console.log(fields, lines);

  useEffect(() => {
    if (fields.length == 0) return;
    setColumnWidths(new Array(fields.length - 1).fill(100)); // Set initial column widths
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

    const stopResize = () => {
      window.removeEventListener('mousemove', doResize);
      window.removeEventListener('mouseup', stopResize);
    };

    window.addEventListener('mousemove', doResize);
    window.addEventListener('mouseup', stopResize);
  };

  return (
    <div className="tableWrapper">
      <div className="table">
        <div className="row">
          {fields.map((field, index) => index !== fields.length - 1 ? (
            <div key={index} className="cell" style={{ width: columnWidths[index] }}>
              {field.title}
              <div className="resizeHandle" onMouseDown={(event) => handleResize(index, event)} />
            </div>
          ) : (
            <div key={index} className="cell lastCell">{field.title}</div>
          ))}
        </div>
        {lines.map((line, rowIndex) => (
          <div key={rowIndex} className="row">
            {line.cells.map((cell, index) => index !== line.cells.length - 1 ? (
              <div key={index} className="cell" style={{ width: columnWidths[index] }}>
                {cell.jsx}
                <div className="resizeHandle" onMouseDown={(event) => handleResize(index, event)} />
              </div>
            ) : (
              <div key={index} className="cell lastCell">{cell.jsx}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResizableTable;
