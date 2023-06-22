import CompiledProxyInterface from "./CompiledProxyInterface";

export default interface TableProxyInterface extends CompiledProxyInterface {
    isSelected: boolean;
    isTesting: boolean;
    isWorking?: boolean;
}