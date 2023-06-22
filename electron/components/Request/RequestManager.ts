import ProxyInterface from "./ProxyInterface";
import RequestPromise from "./Request";
import SuperMethods from "../SuperMethods/SuperMethods";
import request from "request";

class RequestManager {
    requests: RequestPromise[];
    actualRequestIndex: number;

    constructor() {
        this.requests = [];
        this.actualRequestIndex = 0;
    }

    async addProxies(proxies: ProxyInterface[]) {
        const results = [];

        for (var proxy of proxies) {
            try {
                const request = new RequestPromise(proxy);
                const myHost = await request.getMyIp();
                results.push(myHost);
                this.addRequest(request);
            } catch (err) {
                results.push(null);
                console.log(`Прокси ${proxy.host}:${proxy.port} не работает: ${err}`);
                //throw new Error(`Прокси ${proxy.host} не работает: ${err}`);
            }
        }

        return results;
    }

    addRequest(request: RequestPromise) {
        this.requests.push(request);
    }

    removeRequest(id: string){
        for (var request of this.requests){
            if (request.id === id){
                //remove
            }
        }
    }

    getActualRequest(){
        if (this.requests.length === 0){
            throw new Error(`No requests in manager!`);
        }
        const request = this.requests[this.actualRequestIndex];

        if (this.actualRequestIndex + 1 === this.requests.length){
            this.actualRequestIndex = 0;
        } else {
            this.actualRequestIndex += 1;
        }

        return request;
    }

    multiRequest(array: unknown[], cycle: MultiRequestCb) {
        const n = SuperMethods.Div(array.length, this.requests.length);
        var modulo = array.length % this.requests.length;
        var count = 0;
        var promises = [];

        for (var i in this.requests) {
            if (modulo > 0) {
                promises.push(cycle(Number(i), this.requests[i], array.slice(count, count + n + 1)));
                modulo -= 1;
                count = count + n + 1;
            } else {
                promises.push(cycle(Number(i), this.requests[i], array.slice(count, count + n)));
                count += n;
            }
        }
        return Promise.all(promises);
    }


}

export default RequestManager;

type MultiRequestCb = (n: number, request: RequestPromise, data: any[]) => void;