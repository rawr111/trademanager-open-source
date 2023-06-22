import application from "../application";

export default (accountId: string, accountName: string) => {
    return application.windowsManager.askSomething(accountId, accountName, 'mailCode');
}