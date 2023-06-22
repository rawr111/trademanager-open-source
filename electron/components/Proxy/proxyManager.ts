import ProxyStorage from "../newStorage/ProxyStorage";
import Proxy from "./Proxy";
import ProxyInterface from "../../interfaces/Proxy/ProxyInterface";
import CompiledProxyInterface from '../../interfaces/Proxy/CompiledProxyInterface';
import Manager from "../manager/manager";
import application from "../application/application";

export class ProxyManager {
    objects: Proxy[];

    constructor() {
        this.objects = [];
    }

    addNew(proxy: Proxy) {
        try {
            this.objects = [...this.objects, proxy];
            /*
            for (var profileId of proxy.params.profileIds){
                Manager.LinkProxyToProfile(profileId, proxy.params.id);
            }
            for (var steamAccountId of proxy.params.steamAccountIds){
                console.log(`link sa#${steamAccountId} to p#${proxy.params.id}`);
                Manager.LinkProxyToSteamAccount(steamAccountId, proxy.params.id);
            }*/

        } catch (err) {
            throw new Error(`Cant add new steam account to manager: ${err}`);
        }
    }
    delete(id: string) {
        try {
            const index = this.objects.findIndex(obj => obj.params.id === id);
            if (index === -1) throw new Error(`#${id} - proxy is not exist`);
            this.objects.splice(index, 1);
            ProxyStorage.Delete(id);
        } catch (err) {
            throw new Error(`Cant delete proxy: ${err}`);
        }
    }
    edit(id: string, newProxyData: { [K in keyof ProxyInterface]?: ProxyInterface[K] }) {
        try {
            const object = this.objects.find(object => object.params.id === id);
            if (!object) throw new Error(`#${id} - proxy is not exist`);
            object.editParams(newProxyData);
        } catch (err) {
            throw new Error(`Cant edit proxy: ${err}`);
        }
    }
    load() {
        try {
            const proxies = ProxyStorage.GetAll();
            console.log('load proxies: ');
            console.log(proxies);
            const objectsArray = Object.values(proxies);
            this.objects = [];
            for (var object of objectsArray) {
                const proxy = new Proxy(object);
                this.addNew(proxy);
            }
            this.sendProxiesToFront();
        } catch (err) {
            throw new Error(`Cant load proxies: ${err}`);
        }
    }
    sendProxiesToFront() {
        const proxies = this.getCompiledObjects();
        application.sendToMain('GET_PROXIES', proxies);
    }
    getCompiledObjects() {
        const compiledObjects: CompiledProxyInterface[] = [];
        for (var proxy of this.objects) {
            const compiledObject = ProxyManager.CompileObject(proxy);
            compiledObjects.push(compiledObject);
        }
        console.log('compiled proxy:');
        console.log(compiledObjects);
        return compiledObjects;
    }
    getById(id: string) {
        const objects = this.objects.filter(obj => obj.params.id === id);
        if (objects.length === 0) return null;
        return objects[0];
    }
    static CompileObject(object: Proxy) {
        try {
            const linkedData = Manager.GetProxyLinkedData(object.params.id);

            const compiledObject: CompiledProxyInterface = {
                ...object.params,
                steamAccounts: linkedData.steamAccounts,
                steamAccountIds: linkedData.steamAccounts.map(sa => sa.id)
            }
            return compiledObject;
        } catch (err) {
            throw new Error(`Error in compile proxy: ${err}`);
        }
    }
}

export default new ProxyManager();