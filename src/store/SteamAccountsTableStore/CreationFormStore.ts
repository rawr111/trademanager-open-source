import CreationStepType from "../../../electron/interfaces/SteamAccount/CreationStepType";
import ProxySetupInterface from "../../../electron/interfaces/Proxy/ProxySetupInterface";
import SteamAccountsTableStore from "./SteamAccountsTableStore"
import MaFileInterface from "../../../electron/interfaces/SteamAccount/MaFileInterface";
import SmaFileInterface from "../../../electron/interfaces/SteamAccount/SmaFileInterface";
import store from "../store";
import { makeAutoObservable, toJS } from "mobx";

class CreationFormStore {
    root: SteamAccountsTableStore;
    switches: {
        creationType: 'new' | 'import',
        guardConnectingType: 'new' | 'maFile',
        proxy: 'noProxy' | 'newProxy' | 'savedProxy'
    }
    currentProcess: 'creation' | 'guardConnecting' | 'dataFilling';
    guardSetupProcessError: string;
    guardSetupProcessStep: CreationStepType;
    creationProcessError: string;
    creationProcessStep: CreationStepType;
    isOpen: boolean;
    content: {
        accountName: string,
        password: string,
        tmApiKey: string,
        proxy: {
            new: ProxySetupInterface,
            savedId: string | null
        },
        useSteamCookies: boolean,
        maFile: MaFileInterface | null,
        importedAccounts: { smaFile: SmaFileInterface, proxyId: string | null, tempId: string }[],
        profileName: string,
        mail: string,
        mailPassword: string,
    };

    constructor(root: SteamAccountsTableStore) {
        this.root = root;
        this.switches = {
            creationType: 'new',
            guardConnectingType: 'new',
            proxy: 'noProxy'
        }
        this.currentProcess = 'dataFilling';
        this.isOpen = false;
        this.guardSetupProcessError = '';
        this.guardSetupProcessStep = 'start';
        this.creationProcessError = '';
        this.creationProcessStep = 'start'
        this.content = {
            accountName: "",
            password: "",
            tmApiKey: "",
            proxy: {
                new: { host: '', port: '', username: '', password: '' },
                savedId: null
            },
            useSteamCookies: true,
            maFile: null,
            importedAccounts: [],
            mail: "",
            mailPassword: "",
            profileName: ""
        }

        window.Main.steamAccounts.onCreationProcessStep((event, step) => {
            this.setCreationProcessStep(step);
        });
        window.Main.steamAccounts.onCreationProcessError((event, error) => {
            this.setCreationProcessStep('error');
            this.setCreationProcessError(String(error));
        });
        window.Main.guardConnection.onSetupStep((event, step) => {
            this.setGuardSetupProcessStep(step);
        });
        window.Main.guardConnection.onSetupError((event, error) => {
            this.setGuardSetupProcessStep('error');
            this.setGuardSetupProcessError(String(error));
        });

        makeAutoObservable(this);
    }

    open() {
        this.isOpen = true;
        this.content.accountName = "";
        this.content.password = "";
        this.content.maFile = null;
        this.content.importedAccounts = [];
        this.content.proxy.new = { host: "", port: "", username: "", password: "" };
        this.content.proxy.savedId = null;
        this.runDataFillingProcess();
    }
    close() {
        if (this.currentProcess === 'creation' && !(this.creationProcessStep === 'end' || this.creationProcessStep === 'error')) {
            return store.windows.prompt({
                text: 'Аккаунт не будет создан 😨',
                type: 'question',
                title: 'Хотите прервать создание аккаунта?',
                acceptButtonText: 'Прервать',
                cb: () => {
                    this.isOpen = false;
                    window.Main.steamAccounts.abortCreation();
                }
            });
        }
        if (this.currentProcess === 'guardConnecting' && !(this.guardSetupProcessStep === 'end' || this.guardSetupProcessStep === 'error')) {
            return store.windows.prompt({
                text: 'Гуард не будет подключен 😨',
                type: 'question',
                title: 'Хотите прервать подключение Guard?',
                acceptButtonText: 'Прервать',
                cb: () => {
                    this.isOpen = false;
                    window.Main.guardConnection.abortSetup();
                }
            });
        }
        this.isOpen = false;
    }
    getContent() { return toJS(this.content); }

    setCreationProcessError(error: string) { this.creationProcessError = error; }
    setCreationProcessStep(step: CreationStepType) { this.creationProcessStep = step; }
    setGuardSetupProcessError(error: string) { this.guardSetupProcessError = error; }
    setGuardSetupProcessStep(step: CreationStepType) { this.guardSetupProcessStep = step; }

    runCreationProcess() {
        const content = this.getContent();
        if (!content.maFile || !content.accountName || !content.password) return;

        let proxyId: string | null = null;
        let newProxy: ProxySetupInterface | null = null;

        switch (this.switches.proxy) {
            case "newProxy":
                newProxy = content.proxy.new;
                break;
            case "savedProxy":
                proxyId = content.proxy.savedId;
                break;
            case "noProxy":
                break;
        }

        window.Main.steamAccounts.creationProcess({
            accountName: content.accountName,
            password: content.password,
            tmApiKey: content.tmApiKey,
            maFile: content.maFile,
            familyViewPin: null,
            mail: content.mail,
            mailPassword: content.mailPassword,
            profileName: content.profileName,
            useSteamCookies: content.useSteamCookies
        }, {
            proxyId: proxyId,
            newProxy: newProxy
        });
        this.currentProcess = 'creation';
        this.creationProcessStep = 'start';
        this.creationProcessError = '';
    }
    runGuardSetupProcess() {
        const content = this.getContent();
        if (!content.accountName || !content.password) return;

        let proxyId: string | null = null;
        let newProxy: ProxySetupInterface | null = null;

        switch (this.switches.proxy) {
            case "newProxy":
                newProxy = content.proxy.new;
                break;
            case "savedProxy":
                proxyId = content.proxy.savedId;
                break;
            case "noProxy":
                break;
        }

        window.Main.guardConnection.setup(content, { proxyId: proxyId, newProxy: newProxy });
        this.currentProcess = 'guardConnecting';
        this.guardSetupProcessStep = 'start';
        this.guardSetupProcessError = '';
    }
    runDataFillingProcess() { this.currentProcess = 'dataFilling'; }
    editContent(newContent: { [K in keyof typeof this.content]?: typeof this.content[K] }) { this.content = { ...this.content, ...newContent }; }
    editSwitches(newSwitches: { [K in keyof typeof this.switches]?: typeof this.switches[K] }) { this.switches = { ...this.switches, ...newSwitches }; }
}

export default CreationFormStore;