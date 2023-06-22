import Store from 'electron-store';
import ProxyInterface from '../../interfaces/Proxy/ProxyInterface';
import cryptoUserData from './cryptoUserData';
const store = new Store();

class ProxyStorage {
    static GetAll() {
        const proxies = store.get('proxies');
        const decryptedProxies = cryptoUserData.decryptObject(proxies);
        if (!decryptedProxies) {
            return {};
        }
        return decryptedProxies as { [id: string]: ProxyInterface };
    }
    static GetById(id: string) {
        const proxy = store.get(`proxies.${id}`);
        const decryptedProxy = cryptoUserData.decryptObject(proxy) as ProxyInterface;
        if (!proxy) throw new Error(`proxy ${id} is not exist`);
        return decryptedProxy;
    }
    static EditData(id: string, newObject: { [K in keyof ProxyInterface]?: ProxyInterface[K] }) {
        const proxy = ProxyStorage.GetById(id);
        if (proxy.id != id) throw new Error(`${id} doesnt match with ${proxy.id}`);
        const newProxy = { ...proxy, ...newObject };
        ProxyStorage.Save(id, newProxy);
    }
    static Save(id: string, proxy: ProxyInterface) {
        const encryptedProxy = cryptoUserData.encryptObject(proxy);
        store.set(`proxies.${id}`, encryptedProxy);
    }
    static Delete(id: string) {
        store.delete(`proxies.${id}`);
    }
}

export default ProxyStorage;