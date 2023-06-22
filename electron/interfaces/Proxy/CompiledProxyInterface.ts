import SteamAccountInterface from '../SteamAccount/SteamAccountInterface';
import ProxyInterface from './ProxyInterface';

interface CompiledProxyInterface extends ProxyInterface {
    steamAccountIds: string[];
    steamAccounts: SteamAccountInterface[];
}

export default CompiledProxyInterface;