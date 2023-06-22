import steamAccountManager from "../../SteamAccount/steamAccountManager";
import application from "../application";

export default async (accountId: string, accountName: string) => {
    const pin = await application.windowsManager.askSomething(accountId, accountName, 'familyPin');
    const steamAccount = steamAccountManager.getById(accountId);
    if (steamAccount) steamAccount.editParams({ familyViewPin: pin });
    return pin;
}