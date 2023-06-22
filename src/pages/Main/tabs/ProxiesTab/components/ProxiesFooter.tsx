import react, { FC } from 'react';
import '../../../../../css/Footer.css';
import { observer } from 'mobx-react';
import store from '../../../../../store/store';
import Button from '../../../../../globalComponents/Button/Button';
import TablePageSwitcher from '../../../../../globalComponents/TablePageSwitcher/TablePageSwitcher';

const ProxiesFooter: FC = observer(() => {
    const proxies = store.proxiesTable.getProxies().filter(p => !p.deleted || store.proxiesTable.showDeleted);
    const proxiesByPage = store.proxiesTable.getProxiesByPages();
    const selectedProxies = proxies.filter(p => p.isSelected);

    return (
        <>
            <div className="footer">
                <div className="footer__accounts-number">
                    <TablePageSwitcher numberOfElements={proxies.length} numberOfPages={proxiesByPage.length} options={{ avalible: [5, 10, 15, 20, 40, 100] }} pageSize={store.proxiesTable.pageSize} activePageNumber={store.proxiesTable.activePage} onChangeActivePage={(activePage) => {
                        store.proxiesTable.setActivePage(activePage);
                    }}
                        onChangePageSize={(newPageSize) => {
                            console.log(newPageSize);
                            store.proxiesTable.setPageSize(newPageSize)
                        }} />
                </div>
                <div className="footer__control">
                    <div className="footer__select-number">
                        <span className="text-grey-large">Выбрано</span>
                        <span className="text-white-large footer__info">{selectedProxies.length}</span>
                    </div>

                    <Button
                        disabled={false}
                        view="default"
                        size="large"
                        color="grey"
                        hoverColor="grey"
                        img="./assets/img/Trash.svg"
                        hoverImg="./assets/img/Trash_hov.svg"
                        text="Удалить"
                        onClick={() => {
                            const selectedProxies = store.proxiesTable.getProxies().filter(p => p.isSelected);
                            if (selectedProxies.length === 0) return;
                            store.windows.prompt({
                                type: 'question',
                                title: `Хотите переместить в архив ${selectedProxies.length} прокси?`,
                                text: `Прокси №{${selectedProxies.map(p => p.number).join(', ')}} будут убраны. Их всегда можно восстановить/удалить окночательно (просто кликни на глазик в верхней панели)`,
                                acceptButtonText: `Удалить ${selectedProxies.length} прокси`,
                                cancelButtonText: 'Отмена',
                                cb: () => {
                                    for (var proxy of selectedProxies) {
                                        store.proxiesTable.editProxyInStorage(proxy.id, { deleted: true }, {
                                            steamAccountIds: []
                                        });
                                    }
                                }
                            });
                        }}
                    />
                </div>
            </div>
        </>
    );
});

export default ProxiesFooter;