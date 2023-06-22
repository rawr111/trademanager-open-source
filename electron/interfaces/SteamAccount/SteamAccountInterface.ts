import SmaFileInterface from './SmaFileInterface';
import ChangableSecondaryInterface from './ChangableSecondaryInterface';

export default interface SteamAccountInterface extends SmaFileInterface {
    id: string;
    number: number;
    deleted: boolean;
    changableSecondary: ChangableSecondaryInterface;
}