import CompiledSteamAccountInterface from "./CompiledSteamAccountInterface";
import SmaFileInterface from "./SmaFileInterface";

export default interface TableSteamAccountInterface extends CompiledSteamAccountInterface {
    isSelected: boolean;
    authCode: string;
    getChangableSecondaryError: string | null;
    isLoadChangableSecondary: boolean;
    isLoadSecondary: boolean;
    getSecondaryError: string | null;
    isLogining: boolean;
}