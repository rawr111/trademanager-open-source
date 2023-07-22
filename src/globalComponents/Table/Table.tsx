import React, { useState, useEffect, MouseEvent, useRef } from 'react';
import './Table.css'; // Import your CSS file
import Field from '../../../electron/interfaces/TableFields/Field';
import AvalibleFieldTypes from '../../../electron/interfaces/TableFields/AvalibleFieldTypes';
import uuid from 'react-uuid';
import ReactTooltip from 'react-tooltip';

export interface Cell { type: AvalibleFieldTypes, jsx: JSX.Element };
export interface Line { cells: Cell[], deleted: boolean };
export interface TableDataInterface {
  fields: Field[],
  lines: Line[],
  isSelected?: boolean,
  onSelect?: (isChecked: boolean) => void,
  onSort?: (fieldType: AvalibleFieldTypes, direction: 'UP' | 'DOWN') => void,
  onChangeFieldWidth?: (fieldType: AvalibleFieldTypes, newWidth: number) => void
};

const Table: React.FC<TableDataInterface> = ({ fields, lines, onChangeFieldWidth }) => {
  const ref = useRef(null);
  const [columnWidths, setColumnWidths] = useState<number[]>([]);
  const [altText, setAltText] = useState(<></>);
  const textBoxId = uuid();

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
      <ReactTooltip place="top" type="dark" effect="float" id={textBoxId}>
        ASDF
      </ReactTooltip>
      <div className="table__wrapper" ref={ref} onWheel={(e) => {
        if (ref.current)
          (ref.current as HTMLDivElement).scrollLeft += e.deltaY;
      }}>
        <div className="table__row table__row--first">
          {fields.map((field, index) =>
            <div key={index} className="table__cell" style={{ width: columnWidths[index] }} data-tip="React-tooltip"
              data-for={textBoxId}>
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

const getAltText = (field: Field) => {
  switch (field.type) {
    case AvalibleFieldTypes.linkedProxies:
      return <div className='alt-text-container'>Все действия с этим Steam аккаунтом программа будет выполнять через указанный прокси</div>
    case AvalibleFieldTypes.steamAccountName:
      return <div className='alt-text-container'>Это логин, который вы вводите при входе в Steam</div>
    case AvalibleFieldTypes.steamPassword:
      return <div className='alt-text-container'>Пароль от Steam аккаунта (что тут еще можно сказать???🙄)</div>
    case AvalibleFieldTypes.steamAccountLevel:
      return <div className='alt-text-container'>Ваш уровень Steam</div>
    case AvalibleFieldTypes.tradeState:
      return <div className='alt-text-container'>Может ли аккаунт отправлять трейды</div>
    case AvalibleFieldTypes.tpState:
      return <div className='alt-text-container'>Показывает открыта ли на аккаунте торговая площадка</div>
    case AvalibleFieldTypes.ktState:
      return <div className='alt-text-container'>Статус красной таблички в Steam. Упоси господь увидеть здесь что-то отличное от слова ОК 😈</div>
    case AvalibleFieldTypes.steamAccountBalance:
      return <div className='alt-text-container'>Здесь отображаются балансы Steam😙. Что еще сказать?</div>
    case AvalibleFieldTypes.csgoTmBalance:
      return <div className='alt-text-container'>Здесь отображаются балансы ваших аккаунтах на сайте https://market.csgo.com. Условие для отображение: необходимо указать api ключ в настройках</div>
    case AvalibleFieldTypes.number:
      return <div className='alt-text-container'>Это номер в системе. Его нельзя изменить. По сути это просто цифра для более удобной работы</div>
    case AvalibleFieldTypes.steamAccountNickname:
      return <div className='alt-text-container'>Тут отображаются никнеймы из Steam (из профиля)</div>;
    case AvalibleFieldTypes.tmApiKey:
      return <div className='alt-text-container'>Api ключ от сайта https://market.csgo.com Нужен для получения баланса оттуда. Если вы не работаете с маркетом, то вполне можно оставить это поле пустым</div>;

    case AvalibleFieldTypes.proxyHost:
      return <div className='alt-text-container'>Тут располагаются хосты прокси. Это часть ip адреса. Например: 123.123.123.123</div>;
    case AvalibleFieldTypes.proxyPort:
      return <div className='alt-text-container'>Тут отображаются порты прокси. Например: 30013</div>;
    case AvalibleFieldTypes.proxyUsername:
      return <div className='alt-text-container'>Тут отображаются логины от ваших прокси</div>;
    case AvalibleFieldTypes.proxyPassword:
      return <div className='alt-text-container'>Тут отображаются пароли от ваших прокси</div>;
    case AvalibleFieldTypes.linkedSteamAccounts:
      return <div className='alt-text-container'>Тут отображаются номера подключенных аккаунтов к данному прокси. (Каждый аккаунт из списка номеров будет работать через указанный прокси)</div>;
    case AvalibleFieldTypes.linkedProfiles:
      return <div className='alt-text-container'>Тут отображаются номера подключенных профилей к данному прокси (Каждый профиль из списка номеров будет работать через указанный прокси)</div>;
  }
  return "";
}

export default Table;