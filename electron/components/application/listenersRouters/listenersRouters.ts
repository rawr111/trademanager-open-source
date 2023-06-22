import windowsListeners from './windowsListenersRouter';
import proxiesListeners from './proxiesListenersRouter';
import steamAccountsListeners from './steamAccountsListenersRouter';

export default () => {
    windowsListeners();
    proxiesListeners();
    steamAccountsListeners();
}