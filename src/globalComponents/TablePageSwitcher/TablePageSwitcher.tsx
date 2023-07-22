import React, { FC, useState } from 'react';
import './TablePageSwitcher.css';
import Dropdown from 'react-dropdown';

const TablePageSwitcher: FC<{
    options?: {
        numberOfElementsInPage?: number,
        avalible?: number[]
    }
    pageSize: number,
    numberOfElements: number,
    numberOfPages: number,
    activePageNumber: number,
    onChangeActivePage: (newActivePageNumber: number) => void,
    onChangePageSize: (newPageSize: number) => void
}> = ({ options = { numberOfElementsInPage: 10, avalible: [5, 10, 15] }, pageSize, numberOfPages, activePageNumber, onChangeActivePage, onChangePageSize, numberOfElements }) => {
    return <>
        <div className='table-footer-left'>
            <div className='table-footer-left_item'><span className="text-grey-large">Всего элементов: </span>{numberOfElements}</div>
            <div className='table-footer-left_item'><span className="text-grey-large">Страница: </span>{activePageNumber} / {numberOfPages === 0 ? 1 : numberOfPages}</div>
            <div className='table-footer-left_item' style={{ display: 'flex' }}>
                <span className="text-grey-large">Элементов на странице:</span>
                <Dropdown options={options.avalible!.map(el => String(el))} onChange={(el) => {
                    onChangePageSize(Number(el.value));
                }} value={String(pageSize)} />
            </div>
            <div className='table-footer-left_item table-footer-img-item'>
                <div>
                    <img onClick={() => {
                        if (activePageNumber === 1 || numberOfPages === 0) return;
                        onChangeActivePage(1);
                    }} style={{ cursor: activePageNumber === 1 || numberOfPages === 0 ? 'default' : 'pointer' }} src={activePageNumber === 1 || numberOfPages === 0 ? "./assets/img/Footer-first-page-not-active.svg" : "./assets/img/Footer-first-page.svg"} className="page-switcher-img" alt="" />
                    <img onClick={() => {
                        if (activePageNumber === 1 || numberOfPages === 0) return;
                        onChangeActivePage(activePageNumber - 1);
                    }} style={{ cursor: activePageNumber === 1 || numberOfPages === 0 ? 'default' : 'pointer' }} src={activePageNumber === 1 || numberOfPages === 0 ? "./assets/img/Footer-prev-page-not-active.svg" : "./assets/img/Footer-prev-page.svg"} className="page-switcher-img" alt="" />
                </div>
                <div>
                    <img onClick={() => {
                        if (activePageNumber === numberOfPages || numberOfPages === 0) return;
                        onChangeActivePage(activePageNumber + 1);
                    }} style={{ cursor: activePageNumber >= numberOfPages || numberOfPages === 0 ? 'default' : 'pointer' }} src={activePageNumber === numberOfPages || numberOfPages === 0 ? "./assets/img/Footer-next-page-not-active.svg" : "./assets/img/Footer-next-page.svg"} className="page-switcher-img" alt="" />
                    <img onClick={() => {
                        if (activePageNumber === numberOfPages || numberOfPages === 0) return;
                        onChangeActivePage(numberOfPages)
                    }}
                        style={{ cursor: activePageNumber === numberOfPages || numberOfPages === 0 ? 'default' : 'pointer' }} src={activePageNumber === numberOfPages || numberOfPages === 0 ? "./assets/img/Footer-last-page-not-active.svg" : "./assets/img/Footer-last-page.svg"} className="page-switcher-img" alt="" />
                </div>
            </div>
        </div>
    </>;
}
export default TablePageSwitcher;