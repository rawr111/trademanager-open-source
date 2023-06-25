import MaFileInterface from "./MaFileInterface";

export default interface SteamAccountSetupInterface {
    accountName: string;
    password: string;
    maFile: MaFileInterface;
    familyViewPin: number | null;
    tmApiKey?: string;
    profileName?: string;
    mail?:string;
    mailPassword?:string;
    useSteamCookies: boolean;
    autoConfirmTrades: boolean;
}