import SteamAccountInterface from "../../interfaces/SteamAccount/SteamAccountInterface";
import SteamAccount from "./SteamAccount";
import CompiledSteamAccountInterface from "../../interfaces/SteamAccount/CompiledSteamAccountInterface";
import SteamAccountStorage from "../newStorage/SteamAccountStorage";
import Manager from "../manager/manager";
import application from "../application/application";
import SteamAccountChannels from "../../interfaces/IpcChannels/SteamAccountChannels";

export class SteamAccountManager {
    objects: SteamAccount[];

    constructor() {
        this.objects = [];
    }

    addNew(steamAccount: SteamAccount) {
        this.objects = [...this.objects, steamAccount];
    }
    sendAccountsToFront() {
        const steamAccounts = this.getCompiledObjects();
        application.sendToMain(SteamAccountChannels.STEAM_ACCOUNT_GET, steamAccounts);
    }
    delete(id: string) {
        try {
            const index = this.objects.findIndex(obj => obj.params.id === id);
            if (index === -1) throw new Error(`#${id} - steam account is not exist`);
            this.objects.splice(index, 1);
            SteamAccountStorage.Delete(id);
            try {
                const thisAccount = SteamAccountStorage.GetById(id);
                console.log(thisAccount);
            } catch (err){
                console.log(`account ${id} has been deleted`);
            }
            this.sendAccountsToFront();
        } catch (err) {
            throw new Error(`Cant delete steam account: ${err}`);
        }
    }
    edit(id: string, newSteamAccountData: { [K in keyof SteamAccountInterface]?: SteamAccountInterface[K] }) {
        try {
            const object = this.objects.find(object => object.params.id === id);
            if (!object) throw new Error(`#${id} - steam account is not exist`);
            object.editParams(newSteamAccountData);
        } catch (err) {
            throw new Error(`Cant edit steam account: ${err}`);
        }
    }
    async load() {
        try {
            const objects = SteamAccountStorage.GetAll();
            const objectsArray = Object.values(objects);
            this.objects = [];
            
            for (var object of objectsArray) {
                const steamAccount = new SteamAccount(object);
                steamAccount.initSession();
                this.addNew(steamAccount);
            }
            this.sendAccountsToFront();
        } catch (err) {
            throw new Error(`Cant load steam accounts: ${err}`);
        }
    }
    getCompiledObjects() {
        const startTime = new Date();
        const compiledObjects: CompiledSteamAccountInterface[] = [];
        for (var obj of this.objects) {
            const compiledObject = SteamAccountManager.CompileObject(obj);
            compiledObjects.push(compiledObject);
        }
        const endTime = new Date();
        const dif = Number(endTime) - Number(startTime);
        console.log(`get compiled objects time: ${dif}ms; start time: ${Number(startTime)}; endTime: ${Number(endTime)};`);
        return compiledObjects;
    }
    getById(id: string) {
        const objects = this.objects.filter(sa => sa.params.id === id);
        if (objects.length === 0) return null;
        return objects[0];
    }
    getByAccountName(accountName: string){
        const objects = this.objects.filter(sa => sa.params.accountName === accountName);
        if (objects.length === 0) return null;
        return objects[0];
    }
    static CompileObject(object: SteamAccount) {
        const linkedData = Manager.GetSteamAccountLinkedData(object.params.id);

        const compiledObject: CompiledSteamAccountInterface = {
            ...object.params,
            smaFile: object.getSmaFile(),
            proxy: linkedData.proxy
        }
       
        return compiledObject;
    }
}

export default new SteamAccountManager();