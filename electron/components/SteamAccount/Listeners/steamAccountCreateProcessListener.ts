import SuperMethods from "../../SuperMethods/SuperMethods";
import steamAccountManager from "../steamAccountManager";
import Manager from "../../manager/manager";
import maFileLogin from '../Processes/maFileLogin';
import SteamAccountSetupInterface from "../../../interfaces/SteamAccount/SteamAccountSetupInterface";
import steamAccountImport from "../Processes/steamAccountImport";
import SteamAccountChannels from "../../../interfaces/IpcChannels/SteamAccountChannels";
import application from "../../application/application";
import CreationStepType from "../../../interfaces/SteamAccount/CreationStepType";
import ProxyInterface from "../../../interfaces/Proxy/ProxyInterface";
import proxyManager from "../../Proxy/proxyManager";
import ProxySetupInterface from "../../../interfaces/Proxy/ProxySetupInterface";
import Proxy from "../../Proxy/Proxy";
import ProxyStorage from "../../newStorage/ProxyStorage";

export default async (event: Electron.IpcMainEvent, params: { steamAccount: SteamAccountSetupInterface, links: { proxyId: string | null, profileId: string | null, newProxy: ProxySetupInterface | null  } }) => {
    try {
        const nextStep = (step: CreationStepType) => application.sendToMain(SteamAccountChannels.STEAM_ACCOUNT_CREATE_PROCESS_STEP, step);
        nextStep("start");
        console.log('create new account');
        await SuperMethods.Sleep(3000);

        let proxy: ProxyInterface | undefined;
        if (params.links.proxyId){
            proxy = proxyManager.getById(params.links.proxyId)?.params;
            console.log(`link proxy: ${proxy?.id}`);
        }
        if (params.links.newProxy){
            proxy = Proxy.Generate(params.links.newProxy);
            //ProxyStorage.Save(newProxy.id, newProxy);
            //const newProxyObj = new Proxy(newProxy);
            //proxyManager.addNew(newProxyObj);
            //proxy = newProxy;
            console.log(`generate new proxy: ${proxy.id}`);
        }
        console.log(params.steamAccount);
        const smaFile = await maFileLogin(params.steamAccount, {
            stepChannel: SteamAccountChannels.STEAM_ACCOUNT_CREATE_PROCESS_STEP,
            abortChannel: SteamAccountChannels.STEAM_ACCOUNT_CREATE_PROCESS_ABORT
        }, proxy);
        console.log(smaFile);
        nextStep("import");
        const steamAccount = steamAccountImport(smaFile);
        nextStep("link");
        if (params.links.newProxy && proxy){
            console.log(`save new proxy: ${proxy.id}`);
            ProxyStorage.Save(proxy.id, proxy);
            const newProxyObj = new Proxy(proxy);
            proxyManager.addNew(newProxyObj);
        }
        if (proxy) Manager.LinkProxyToSteamAccount(steamAccount.id, proxy.id);
        //if (params.links.profileId) Manager.LinkProxyToProfile(steamAccount.id, params.links.profileId);
        steamAccountManager.sendAccountsToFront();
        nextStep("end");
    } catch (err) {
        if (err != 'abort') event.reply(SteamAccountChannels.STEAM_ACCOUNT_CREATE_PROCESS_ERROR, `Ошибка при создании аккаунта: ${err}`);
    }
}