import { ipcMain } from 'electron';
import SteamAccountChannels from '../../../interfaces/IpcChannels/SteamAccountChannels';
import steamAccountCreationProcess from '../../SteamAccount/Listeners/steamAccountCreateProcessListener';
import getAuthCode from '../../SteamAccount/Functions/getAuthCode';
import steamAccountEditListener from '../../SteamAccount/Listeners/steamAccountEditListener';
import steamAccountImportListener from '../../SteamAccount/Listeners/steamAccountImportListener';
import guardSetupProcessListener from '../../SteamAccount/Listeners/guardSetupProcessListener';
import steamAccountDeleteListener from '../../SteamAccount/Listeners/steamAccountDeleteListener';
import steamAccountGetListener from '../../SteamAccount/Listeners/steamAccountGetListener';
import steamAccountSetTableFieldsListener from '../../SteamAccount/Listeners/steamAccountSetTableFieldsListener';
import steamAccountGetTableFieldsListener from '../../SteamAccount/Listeners/steamAccountGetTableFieldsListener';
import steamAccountGetSecondaryListener from '../../SteamAccount/Listeners/steamAccountGetSecondaryListener';
import steamAccountGetChangableSecondaryListener from '../../SteamAccount/Listeners/steamAccountGetChangableSecondaryListener';
import steamAccountRefreshSession from '../../SteamAccount/Listeners/steamAccountRefreshSessionListener';
import steamAccountRefreshStorageListener from '../../SteamAccount/Listeners/steamAccountRefreshStorageListener';
import steamAccountGetTableOptionsListener from '../../SteamAccount/Listeners/steamAccountGetTableOptionsListener';
import steamAccountSetTableOptionsListener from '../../SteamAccount/Listeners/steamAccountSetTableOptionsListener';
import steamAccountConfirmListener from '../../SteamAccount/Listeners/steamAccountConfirmListener';
import steamAccountGetConfirmationsListener from '../../SteamAccount/Listeners/steamAccountGetConfirmationsListener';
import steamAccountStartBrowser from '../../SteamAccount/Listeners/steamAccountStartBrowser';
import steamAccountStopBrowser from '../../SteamAccount/Listeners/steamAccountStopBrowser';
import steamAccountFocusBrowser from '../../SteamAccount/Listeners/steamAccountFocusBrowser';
import getBrowserStatus from '../../SteamAccount/Listeners/GetBrowserStatus';

export default () => {
    ipcMain.on(SteamAccountChannels.STEAM_ACCOUNT_GET_CONFIRMATIONS, steamAccountGetConfirmationsListener);
    ipcMain.on(SteamAccountChannels.STEAM_ACCOUNT_CONFIRM, steamAccountConfirmListener);
    ipcMain.on(SteamAccountChannels.STEAM_ACCOUNT_REFRESH_STORAGE, steamAccountRefreshStorageListener);
    ipcMain.on(SteamAccountChannels.STEAM_ACCOUNT_REFRESH_SESSION, steamAccountRefreshSession)
    ipcMain.on(SteamAccountChannels.STEAM_ACCOUNT_GET_SECONDARY, steamAccountGetSecondaryListener); //тут надо функцию поменять
    ipcMain.on(SteamAccountChannels.STEAM_ACCOUNT_GET_CHANGABLE_SECONDARY, steamAccountGetChangableSecondaryListener);
    ipcMain.on(SteamAccountChannels.STEAM_ACCOUNT_GET_TABLE_FIELDS, steamAccountGetTableFieldsListener);
    ipcMain.on(SteamAccountChannels.STEAM_ACCOUNT_SET_TABLE_FIELDS, steamAccountSetTableFieldsListener);
    ipcMain.on(SteamAccountChannels.STEAM_ACCOUNT_IMPORT, steamAccountImportListener);
    ipcMain.on(SteamAccountChannels.STEAM_ACCOUNT_CREATE_PROCESS, steamAccountCreationProcess);
    ipcMain.on(SteamAccountChannels.STEAM_ACCOUNT_EDIT, steamAccountEditListener);
    ipcMain.on(SteamAccountChannels.STEAM_ACCOUNT_DELETE, steamAccountDeleteListener);
    ipcMain.on(SteamAccountChannels.STEAM_ACCOUNT_GET, steamAccountGetListener);
    ipcMain.on(SteamAccountChannels.GUARD_SETUP_PROCESS, guardSetupProcessListener);
    ipcMain.on(SteamAccountChannels.STEAM_ACCOUNT_AUTH_CODE, getAuthCode);
    ipcMain.on(SteamAccountChannels.STEAM_ACCOUNT_SAVE_TABLE_OPTIONS, steamAccountSetTableOptionsListener);
    ipcMain.on(SteamAccountChannels.STEAM_ACCOUNT_GET_TABLE_OPTIONS, steamAccountGetTableOptionsListener);
    ipcMain.on(SteamAccountChannels.START_BROWSER, steamAccountStartBrowser);
    ipcMain.on(SteamAccountChannels.STOP_BROWSER, steamAccountStopBrowser);
    ipcMain.on(SteamAccountChannels.FOCUS_BROWSER, steamAccountFocusBrowser);
    ipcMain.on(SteamAccountChannels.GET_BROWSER_STARTUS, getBrowserStatus);
}