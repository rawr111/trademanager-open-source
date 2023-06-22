import ProxySetupInterface from './ProxySetupInterface';

export default interface ProxyInterface extends ProxySetupInterface {
    id: string,
    number: number;
    deleted: boolean;
}