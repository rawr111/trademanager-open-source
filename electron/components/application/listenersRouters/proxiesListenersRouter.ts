import { ipcMain } from 'electron';
import proxyManager, { ProxyManager } from '../../Proxy/proxyManager';
import TableStorage from '../../newStorage/TableStorage';
import Field from '../../../interfaces/TableFields/Field';
import TableProxyInterface from '../../../interfaces/Proxy/TableProxyInterface';
import ProxySetupInterface from '../../../interfaces/Proxy/ProxySetupInterface';
import Proxy from '../../Proxy/Proxy';
import ProxyStorage from '../../newStorage/ProxyStorage';
import Manager from '../../manager/manager';
import SuperMethods from '../../SuperMethods/SuperMethods';
import ProxyChannels from '../../../interfaces/IpcChannels/ProxyChannels';
import proxyGetTableOptionsListener from '../../Proxy/listeners/proxyGetTableOptionsListener';
import proxySetTableOptionsListener from '../../Proxy/listeners/proxySetTableOptionsListener';

export default () => {
    ipcMain.on('TEST_PROXY', async (event, id: string) => {
        try {
            const proxy = proxyManager.getById(id);
            if (!proxy) throw new Error(`Прокси #${id} не существует`);
            //await SuperMethods.Sleep(3000);
            const testResult = await proxy.test();
            event.reply('TEST_PROXY', { id, testResult });
        } catch (err) {
            event.reply('ERROR', err);
        }
    });
    ipcMain.on('TEST_PROXY_BY_PARAMS', async (event, proxy: ProxySetupInterface) => {
        try {
            const isWork = await Proxy.Test(proxy);
            console.log(isWork);
            event.reply('TEST_PROXY', { id: 'editing_proxy', testResult: isWork });
        } catch (err){
            event.reply('ERROR', err);
        }
    }); 
    ipcMain.on('REFRESH_PROXIES', async (event) => {
        try {
            proxyManager.load();
            const proxies = proxyManager.getCompiledObjects();
            event.reply('GET_PROXIES', proxies);
        } catch (err) {
            event.reply('ERROR', err);
        }
    });
    ipcMain.on('GET_PROXIES_TABLE_FIELDS', (event) => {
        try {
            const fields = TableStorage.GetFields('proxies');
            event.reply('GET_PROXIES_TABLE_FIELDS', fields);
        } catch (err) {
            event.reply('ERROR', err);
        }
    });
    ipcMain.on('SAVE_PROXIES_TABLE_FIELDS', async (event, fields: Field[]) => {
        try {
            TableStorage.EditFields('proxies', fields);
        } catch (err) {
            event.reply('ERROR', err);
        }
    });
    ipcMain.on('NEW_PROXY', (event, params: { proxy: ProxySetupInterface, links: { steamAccountIds: string[], profileIds: string[] } }) => {
        try {
            const proxyData = Proxy.Generate(params.proxy);
            const proxyObject = new Proxy(proxyData);
            proxyManager.addNew(proxyObject);
            ProxyStorage.Save(proxyData.id, proxyData);
            for (var steamAccountId of params.links.steamAccountIds) {
                Manager.LinkProxyToSteamAccount(steamAccountId, proxyData.id);
            }
            proxyManager.sendProxiesToFront();
        } catch (err) {
            event.reply('ERROR', err);
        }
    });
    ipcMain.on('EDIT_PROXY', (event, params: { id: string, proxy: { [K in keyof TableProxyInterface]?: TableProxyInterface[K] }, links: { steamAccountIds: string[], profileIds: string[] } }) => {
        try {
            proxyManager.edit(params.id, params.proxy);
            Manager.ResetProxy(params.id);
            for (var steamAccountId of params.links.steamAccountIds) {
                Manager.LinkProxyToSteamAccount(steamAccountId, params.id);
            }
            proxyManager.sendProxiesToFront();
        } catch (err) {
            event.reply('ERROR', err);
        }
    });
    ipcMain.on('DELETE_PROXY', async (event, id: string) => {
        try {
            Manager.ResetProxy(id);
            proxyManager.delete(id);
        } catch (err) {
            event.reply('ERROR', err);
        }
    });
    ipcMain.on('GET_PROXIES', (event) => {
        try {
            const proxies = proxyManager.getCompiledObjects();
            event.reply('GET_PROXIES', proxies);
        } catch (err) {
            event.reply('ERROR', err);
        }
    });
    ipcMain.on(ProxyChannels.PROXY_GET_TABLE_OPTIONS, proxyGetTableOptionsListener);
    ipcMain.on(ProxyChannels.PROXY_SET_TABLE_OPTIONS, proxySetTableOptionsListener);
}