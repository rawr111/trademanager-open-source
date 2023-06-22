import Store from 'electron-store';
import LinksInterface from '../../interfaces/Links/LinksInterface';
const store = new Store();

class LinksStorage {
    static Get(): LinksInterface {
        const links = store.get('links');
        if (!links) {
            return {
                steamAccounts: {},
                profiles: {}
            };
        }
        return links as LinksInterface;
    }
    static Save(links: LinksInterface) {
        store.set('links', links);
    }
}

export default LinksStorage;