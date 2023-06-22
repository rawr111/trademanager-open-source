import { ipcMain } from 'electron';
import WindowsChannels from '../../../interfaces/IpcChannels/WindowsChannels';
import closeMainWindowListener from '../WindowsManager/windowsListeners/closeMainWindowListener';
import centerizeMainWindowListener from '../WindowsManager/windowsListeners/centerizeMainWindowListener';
import maximizeMainWindowListener from '../WindowsManager/windowsListeners/maximizeMainWindowListener';
import minimizeMainWindowListener from '../WindowsManager/windowsListeners/minimizeMainWindowListener';
import closeAskWindowListener from '../WindowsManager/windowsListeners/closeAskWindowListener';
import centerizeAskWindowListener from '../WindowsManager/windowsListeners/centerizeAskWindowListener';
import maximizeAskWindowListener from '../WindowsManager/windowsListeners/maximizeAskWindowListener';
import minimizeAskWindowListener from '../WindowsManager/windowsListeners/minimizeAskWindowListener';
import closeConfirmationsWindowListener from '../WindowsManager/windowsListeners/closeConfirmationsWindowListener';
import centerizeConfirmationsWindowListener from '../WindowsManager/windowsListeners/centerizeConfirmationsWindowListener';
import maximizeConfirmationsWindowListener from '../WindowsManager/windowsListeners/maximizeConfirmationsWindowListener';
import minimizeConfirmationsWindowListener from '../WindowsManager/windowsListeners/minimizeConfirmationsWindowListener';
import openConfirmationsWindowListener from '../WindowsManager/windowsListeners/openConfirmationsWindowListener';
import centerizeAuthWindowListener from '../WindowsManager/windowsListeners/centerizeAuthWindowListener';
import closeAuthWindowListener from '../WindowsManager/windowsListeners/closeAuthWindowListener';
import maximizeAuthWindowListener from '../WindowsManager/windowsListeners/maximizeAuthWindowListener';
import minimizeAuthWindowListener from '../WindowsManager/windowsListeners/minimizeAuthWindowListener';
import centerizeErrorWindowListener from '../WindowsManager/windowsListeners/centerizeErrorWindowListener';
import closeErrorWindowListener from '../WindowsManager/windowsListeners/closeErrorWindowListener';
import maximizeErrorWindowListener from '../WindowsManager/windowsListeners/maximizeErrorWindowListener';
import minimizeErrorWindowListener from '../WindowsManager/windowsListeners/minimizeErrorWindowListener';
import getProfileParams from '../WindowsManager/windowsListeners/getProfileParams';

export default () => {
    //main window
    ipcMain.on(WindowsChannels.GET_PROFILE_PARAMS, getProfileParams);
    ipcMain.on(WindowsChannels.CLOSE_MAIN_WINDOW, closeMainWindowListener);
    ipcMain.on(WindowsChannels.CENTERIZE_MAIN_WINDOW, centerizeMainWindowListener);
    ipcMain.on(WindowsChannels.MAXIMIZE_MAIN_WINDOW, maximizeMainWindowListener);
    ipcMain.on(WindowsChannels.MINIMIZE_MAIN_WINDOW, minimizeMainWindowListener);

    //ask window
    ipcMain.on(WindowsChannels.CLOSE_ASK_WINDOW, closeAskWindowListener);
    ipcMain.on(WindowsChannels.CENTERIZE_ASK_WINDOW, centerizeAskWindowListener);
    ipcMain.on(WindowsChannels.MAXIMIZE_ASK_WINDOW, maximizeAskWindowListener);
    ipcMain.on(WindowsChannels.MINIMIZE_ASK_WINDOW, minimizeAskWindowListener);

    //confirmations window
    ipcMain.on(WindowsChannels.CLOSE_CONFIRMATIONS_WINDOW, closeConfirmationsWindowListener);
    ipcMain.on(WindowsChannels.CENTERIZE_CONFIRMATIONS_WINDOW, centerizeConfirmationsWindowListener);
    ipcMain.on(WindowsChannels.MAXIMIZE_CONFIRMATIONS_WINDOW, maximizeConfirmationsWindowListener);
    ipcMain.on(WindowsChannels.MINIMIZE_CONFIRMATIONS_WINDOW, minimizeConfirmationsWindowListener);
    ipcMain.on(WindowsChannels.OPEN_CONFIRMATIONS_WINDOW, openConfirmationsWindowListener);

    //confirmations window
    ipcMain.on(WindowsChannels.CLOSE_AUTH_WINDOW, closeAuthWindowListener);
    ipcMain.on(WindowsChannels.CENTERIZE_AUTH_WINDOW, centerizeAuthWindowListener);
    ipcMain.on(WindowsChannels.MAXIMIZE_AUTH_WINDOW, maximizeAuthWindowListener);
    ipcMain.on(WindowsChannels.MINIMIZE_AUTH_WINDOW, minimizeAuthWindowListener);

    //error window
    ipcMain.on(WindowsChannels.CLOSE_ERROR_WINDOW, closeErrorWindowListener);
    ipcMain.on(WindowsChannels.CENTERIZE_ERROR_WINDOW, centerizeErrorWindowListener);
    ipcMain.on(WindowsChannels.MAXIMIZE_ERROR_WINDOW, maximizeErrorWindowListener);
    ipcMain.on(WindowsChannels.MINIMIZE_ERROR_WINDOW, minimizeErrorWindowListener);
}