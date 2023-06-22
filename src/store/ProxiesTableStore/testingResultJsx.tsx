import TableProxyInterface from "../../../electron/interfaces/Proxy/TableProxyInterface";

export default (props: { isSuccess: boolean, proxy: TableProxyInterface }) => {
    const { isSuccess, proxy } = props;
    return isSuccess ? <>Прокси #{proxy.number} {proxy.host}:{proxy.port} <b style={{color: "#FA403A"}}>НЕ РАБОТАЕТ</b></>
     : <>Прокси #{proxy.number} {proxy.host}:{proxy.port} <b style={{color: "#6BF06C"}}>работает</b></>;
}