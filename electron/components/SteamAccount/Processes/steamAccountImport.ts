import SmaFileInterface from "../../../interfaces/SteamAccount/SmaFileInterface";
import SteamAccountStorage from "../../newStorage/SteamAccountStorage";
import SteamAccount from "../SteamAccount";
import steamAccountManager from "../steamAccountManager";

const steamAccountImport = (smaFile: SmaFileInterface) => {
    try {
        console.log("start import one")
        const steamAccountParams = SteamAccount.Generate(smaFile, null);
        console.log(steamAccountParams);
        const steamAccount = new SteamAccount(steamAccountParams);
        steamAccountManager.addNew(steamAccount);
        SteamAccountStorage.Save(steamAccountParams.id, steamAccountParams);
        console.log("end import one")
        return steamAccountParams;
    } catch (err){
        throw new Error(`Ошибка в функции импорта стим аккаунта: ${err}`);
    }
}

export default steamAccountImport;