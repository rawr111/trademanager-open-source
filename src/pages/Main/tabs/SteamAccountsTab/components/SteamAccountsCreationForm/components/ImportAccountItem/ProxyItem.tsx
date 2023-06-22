import react, { FC } from "react";
import SavedProxies from "../../../ProxyBlock/SavedProxiesBlock/SavedProxies";
import store from "../../../../../../../../store/store";
import { observer } from "mobx-react";
import TableProxyInterface from "../../../../../../../../../electron/interfaces/Proxy/TableProxyInterface";

const ProxyItem: FC<{ onSelect: (newProxy: TableProxyInterface) => void }> =
  observer((props) => {
    const { onSelect } = props;
    const proxies = store.proxiesTable.getProxies();

    return (
      <SavedProxies
        proxies={proxies}
        activeId={null}
        onChange={(newId) => {
          const activeProxy = proxies.filter((p) => p.id === newId)[0];
          onSelect(activeProxy);
        }}
      />
    );
  });

export default ProxyItem;
