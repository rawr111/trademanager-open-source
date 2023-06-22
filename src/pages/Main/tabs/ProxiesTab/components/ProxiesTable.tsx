import react, { FC } from 'react';
import Table, { Line, Cell } from '../../../../../globalComponents/Table/Table';
import AvalibleTypes from '../../../../../../electron/interfaces/TableFields/AvalibleFieldTypes';
import store from '../../../../../store/store';
import TableProxyInterface from '../../../../../../electron/interfaces/Proxy/TableProxyInterface';
import Field from '../../../../../../electron/interfaces/TableFields/Field';
import Checkbox from '../../../../../globalComponents/Checkbox/Checkbox';
import Button from '../../../../../globalComponents/Button/Button';
import Password from '../../../../../globalComponents/Password/Password';
import { observer } from 'mobx-react';

const ProxiesTable: FC = observer(() => {
    const fields = store.proxiesTable.getFields();
    const proxiesByPage = store.proxiesTable.getProxiesByPages();
    const lines: Line[] = [];

    console.log(proxiesByPage);
    if (proxiesByPage[store.proxiesTable.activePage - 1])
        for (var proxy of proxiesByPage[store.proxiesTable.activePage - 1]) {
            if (proxy.deleted && !store.proxiesTable.showDeleted) continue;
            lines.push(generateLine(fields, proxy));
        }
    return (
        <Table
            onSelect={(isSelected) => { store.proxiesTable.selectAllProxies(isSelected); }}
            isSelected={store.proxiesTable.isAllSelected}
            fields={fields}
            lines={lines}
            onSort={(fieldType, direction) => {
                store.proxiesTable.changeFieldDirection(fieldType, direction);
                switch (fieldType) {
                    case AvalibleTypes.number: return store.proxiesTable.proxies.sort((a, b) => direction === 'UP' ? (a.number < b.number ? 1 : -1) : (a.number > b.number ? 1 : -1));
                    case AvalibleTypes.proxyHost: return store.proxiesTable.proxies.sort((a, b) => direction === 'UP' ? (a.host < b.host ? 1 : -1) : (a.host > b.host ? 1 : -1));
                    case AvalibleTypes.proxyPort: return store.proxiesTable.proxies.sort((a, b) => direction === 'UP' ? (a.port < b.port ? 1 : -1) : (a.port > b.port ? 1 : -1));
                    case AvalibleTypes.proxyUsername: return store.proxiesTable.proxies.sort((a, b) => direction === 'UP' ? (a.username < b.username ? 1 : -1) : (a.username > b.username ? 1 : -1));
                    case AvalibleTypes.proxyPassword: return store.proxiesTable.proxies.sort((a, b) => direction === 'UP' ? (a.password < b.password ? 1 : -1) : (a.password > b.password ? 1 : -1));
                }
            }}
        ></Table>
    );
});

const generateLine = (fields: Field[], proxy: TableProxyInterface): Line => {
    const line: Line = { cells: [], deleted: proxy.deleted };

    for (var index in fields) {
        line.cells.push({ type: fields[index].type, jsx: <CellJSX type={fields[index].type} proxy={proxy} /> })
    }
    return line;
}

const CellJSX: FC<{ type: AvalibleTypes, proxy: TableProxyInterface }> = observer((props) => {
    const { type, proxy } = props;
    switch (type) {
        case AvalibleTypes.checkbox:
            if (proxy.deleted) {
                return <Checkbox isChecked={false} disabled={true} onChange={(isChecked) => { }} />;
            }
            return <Checkbox isChecked={proxy.isSelected} onChange={(isChecked) => {
                store.proxiesTable.selectProxy(proxy.id, isChecked)
            }} />;
        case AvalibleTypes.number:
            return <>{proxy.number}</>;
        case AvalibleTypes.proxyHost:
            return <>{proxy.host}</>;
        case AvalibleTypes.proxyPort:
            return <>{proxy.port}</>;
        case AvalibleTypes.proxyUsername:
            return <>{proxy.username}</>;
        case AvalibleTypes.proxyPassword:
            return <Password password={proxy.password} />;
        case AvalibleTypes.testProxyButton:
            return (
                <Button style={{border:  proxy.isWorking != undefined ? (proxy.isWorking ? '2px solid green' : "2px solid red") : "0px solid red"}} img='./assets/img/testProxy.svg' view='icon' color='grey' hoverColor='light-grey' size='small' isLoad={proxy.isTesting} onClick={() => {
                    store.proxiesTable.testProxy(proxy.id);
                }} />
            );
        case AvalibleTypes.editingButton:
            if (proxy.deleted) {
                return <Button size='small' color='grey' hoverColor='light-grey' view='icon' img='./assets/img/restoreProfile.svg' onClick={() => {
                    store.proxiesTable.editProxyInStorage(proxy.id, { deleted: false }, {
                        steamAccountIds: proxy.steamAccountIds
                    });
                }} />;
            } else {
                return <Button size='small' color='grey' hoverColor='light-grey' view='icon' img='./assets/img/Edit.svg' onClick={() => {
                    console.log(`Открываем форму редактирования прокси`);
                    store.proxiesTable.openEditingForm(proxy);
                }} />;
            }
        case AvalibleTypes.deleteButton:
            return <Button size='small' color='grey' hoverColor='light-grey' view='icon' img='./assets/img/Trash.svg' onClick={() => {
                if (proxy.deleted) {
                    store.windows.prompt({
                        type: 'question',
                        title: `Хотите безвозвратно удалить прокси №${proxy.number}?`,
                        text: 'Это действие невозможно будет отменить',
                        acceptButtonText: 'Удалить его!',
                        cancelButtonText: 'Отмена',
                        cb: () => {
                            store.proxiesTable.deleteProxy(proxy.id);
                        }
                    });
                } else {
                    store.windows.prompt({
                        type: 'question',
                        title: `Хотите отправить прокси №${proxy.number} в архив?`,
                        text: 'Его всегда можно будет восстановить или удалить окончательно (просто кликни на глазик в верхней панели)',
                        acceptButtonText: 'Убрать в архив!',
                        cancelButtonText: 'Отмена',
                        cb: () => {
                            store.proxiesTable.editProxyInStorage(proxy.id, { deleted: true }, {
                                steamAccountIds: []
                            });
                        }
                    });
                }
            }} />;
        case AvalibleTypes.linkedSteamAccounts:
            return <>{proxy.steamAccounts.map(sa => sa.number).join(', ')}</>;
        default:
            return <></>;
    }
});

export default ProxiesTable;