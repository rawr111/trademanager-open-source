import ProxyInterface from '../Proxy/ProxyInterface';
import SteamAccountInterface from './SteamAccountInterface';
import SmaFileInterface from './SmaFileInterface';

interface CompiledSteamAccountInterface extends SteamAccountInterface {
    proxy: ProxyInterface | null;
    smaFile: SmaFileInterface;
}

export default CompiledSteamAccountInterface;