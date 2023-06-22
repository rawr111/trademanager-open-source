import react, { FC } from 'react';
import '../../../../../css/Footer.css';
import { observer } from 'mobx-react';
import store from '../../../../../store/store';
import Button from '../../../../../globalComponents/Button/Button';
import TablePageSwitcher from '../../../../../globalComponents/TablePageSwitcher/TablePageSwitcher';

const SteamAccountsFooter: FC = observer(() => {
    const steamAccounts = store.steamAccountsTable.getSteamAccounts();
    const steamAccountsByPage = store.steamAccountsTable.getSteamAccountsByPages();
    const selectedSteamAccounts = Object.values(steamAccounts).filter(p => p.isSelected);

    return (
        <>
            <div className="footer">
                <div className="footer__accounts-number">
                    <TablePageSwitcher numberOfElements={Object.keys(steamAccounts).length} numberOfPages={steamAccountsByPage.length} options={{ avalible: [5, 10, 15, 20, 40, 100] }} pageSize={store.steamAccountsTable.pageSize} activePageNumber={store.steamAccountsTable.activePage} onChangeActivePage={(activePage) => {
                        store.steamAccountsTable.setActivePage(activePage, true);
                    }}
                        onChangePageSize={(newPageSize) => {
                            console.log(newPageSize);
                            store.steamAccountsTable.setPageSize(newPageSize, true)
                        }} />
                </div>


                <div className="footer__control">
                    <div className="footer__select-number">
                        <span className="text-grey-large">Выбрано</span>
                        <span className="text-white-large footer__info">{selectedSteamAccounts.length}</span>
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
                            const selectedSteamAccounts = Object.values(store.steamAccountsTable.getSteamAccounts()).filter(p => p.isSelected);
                            if (selectedSteamAccounts.length === 0) return;

                            store.windows.prompt({
                                type: 'question',
                                title: `Хотите переместить в архив ${selectedSteamAccounts.length} аккаунтов?`,
                                text: `Прокси №{${selectedSteamAccounts.map(p => p.number).join(', ')}} будут убраны. Их всегда можно восстановить/удалить окночательно (просто кликни на глазик в верхней панели)`,
                                acceptButtonText: `Удалить ${selectedSteamAccounts.length} прокси`,
                                cancelButtonText: 'Отмена',
                                cb: () => {
                                    for (var steamAccount of selectedSteamAccounts) {
                                        store.steamAccountsTable.editSteamAccount(steamAccount.id, { deleted: true, isSelected: false });
                                        //store.steamAccountsTable.editSteamAccountInStorage(steamAccount.id, { deleted: true });
                                        window.Main.steamAccounts.edit(steamAccount.id, { deleted: true }, { proxyId: null });
                                    }
                                    window.Main.steamAccounts.get();
                                }
                            });
                        }}
                    />
                </div>
            </div>
        </>
    );
});

export default SteamAccountsFooter;