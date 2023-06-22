import SteamAccountSetupInterface from './SteamAccountSetupInterface';
import SecondaryInterface from './SecondaryInterface';

interface SmaFileInterface extends SteamAccountSetupInterface {
    secondary: SecondaryInterface
}

export default SmaFileInterface;