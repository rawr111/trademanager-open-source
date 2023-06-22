import SteamAccountChannels from "../../../interfaces/IpcChannels/SteamAccountChannels";
import ProxyInterface from "../../../interfaces/Proxy/ProxyInterface";
import ProxySetupInterface from "../../../interfaces/Proxy/ProxySetupInterface";
import CreationStepType from "../../../interfaces/SteamAccount/CreationStepType";
import application from "../../application/application";
import Manager from "../../manager/manager";
import proxyManager from "../../Proxy/proxyManager";
import SuperMethods from "../../SuperMethods/SuperMethods";
import setupGuard from "../Processes/setupGuard";
import steamAccountImport from "../Processes/steamAccountImport";
import steamAccountManager from "../steamAccountManager";
import Proxy from "../../Proxy/Proxy";
import ProxyStorage from "../../newStorage/ProxyStorage";

export default async (event: Electron.IpcMainEvent, params: { accountName: string, password: string, tmApiKey?: string, links: { proxyId: string | null, profileId: string | null, newProxy: ProxySetupInterface | null } }) => {
    try {
        const nextStep = (step: CreationStepType) => application.sendToMain(SteamAccountChannels.GUARD_SETUP_PROCESS_STEP, step)
        nextStep("start");
        await SuperMethods.Sleep(3000);

        let proxy: ProxyInterface | undefined;
        if (params.links.proxyId) {
            proxy = proxyManager.getById(params.links.proxyId)?.params;
        }
        if (params.links.newProxy) {
            const newProxy = Proxy.Generate(params.links.newProxy);
            ProxyStorage.Save(newProxy.id, newProxy);
            const newProxyObj = new Proxy(newProxy);
            proxyManager.addNew(newProxyObj);
            proxy = newProxy;
        }

        const smaFile = await setupGuard({ accountName: params.accountName, password: params.password, tmApiKey: params.tmApiKey }, proxy);
        nextStep("import");
        const steamAccount = steamAccountImport(smaFile);
        nextStep("link");
        if (proxy) Manager.LinkProxyToSteamAccount(steamAccount.id, proxy.id);
        steamAccountManager.sendAccountsToFront();
        nextStep("end");
    } catch (err) {
        if (err != 'abort') event.reply(SteamAccountChannels.GUARD_SETUP_PROCESS_ERROR, `Ошибка при подключении Guard: ${err}`)
    }
}