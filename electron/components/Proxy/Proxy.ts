import ProxyInterface from "../../interfaces/Proxy/ProxyInterface";
import RequestPromise from "../Request/Request";
import { v4 as uuidv4 } from 'uuid';
import ProxyStorage from "../newStorage/ProxyStorage";
import ProxySetupInterface from "../../interfaces/Proxy/ProxySetupInterface";
import proxyManager from "./proxyManager";

class Proxy {
    params: ProxyInterface;
    request: RequestPromise;

    constructor(proxy: ProxyInterface) {
        this.params = proxy;
        this.request = new RequestPromise(this.params);
    }

    editParams(newParams: { [K in keyof ProxyInterface]?: ProxyInterface[K] }) {
        for (var i in this.params) {
            if (typeof (newParams[i]) !== 'undefined') {
                this.params[i] = newParams[i];
            }
        }
        ProxyStorage.EditData(this.params.id, newParams);
    }
    test(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.request.send({ url: 'https://steamcommunity.com/' })
                .then(({ response, body }) => {
                    if (response.statusCode === 200) {
                        resolve(true);
                    } else {
                        reject(false);
                    }
                })
                .catch(err => {
                    resolve(false);
                });
        });
    }
    static Generate(proxy: ProxySetupInterface) {
        const proxies = proxyManager.objects.map(p => p.params);
        const proxiesArray = Object.values(proxies);
        proxiesArray.sort((a, b) => a.number < b.number ? 1 : -1);

        const params: ProxyInterface = {
            id: uuidv4(),
            number: proxiesArray.length === 0 ? 1 : proxiesArray[0].number + 1,
            deleted: false,
            ...proxy
        }
        return params;
    }
    static Test(proxy: ProxySetupInterface){
        return new Promise((resolve, reject)=>{
            const newRequest = new RequestPromise(proxy);
            newRequest.send({ url: 'https://steamcommunity.com/' })
            .then(({ response, body }) => {
                if (response.statusCode === 200) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            })
            .catch(err => {
                resolve(false);
            });
        });
    }
}

export default Proxy;