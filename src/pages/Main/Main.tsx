import Attic from "../../globalComponents/Attic/Attic";
import "./Main.css";
import "../../css/Form.css";
import Navigation from "./components/Navigation/Navigation";
import Prompt from "../../globalComponents/Prompt/Prompt";
import MiniNotification from "../../globalComponents/Notifications/MiniNotifitcation";
import ProxiesTab from "./tabs/ProxiesTab/ProxiesTab";
import SteamAccountsTab from "./tabs/SteamAccountsTab/SteamAccountsTab";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import store from "../../store/store";
import { observer } from "mobx-react";
import SupportTab from "./tabs/SupportTab/SupportTab";
import ExtensionTab from "./tabs/ExtensionsTab/ExtensionsTab";

const Main = observer(() => {
  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <Attic windowName="main" />
        <div className="content">
          <Navigation />
          {store.tabs.active === "steamAccounts" ? <SteamAccountsTab /> : <></>}
          {store.tabs.active === "proxies" ? <ProxiesTab /> : <></>}
          {store.tabs.active === "extensions" ? <ExtensionTab /> : <></>}
          {store.tabs.active === "support" ? <SupportTab /> : <></>}
        </div>
        <Prompt />
        <MiniNotification />
      </DndProvider>
    </>
  );
});

export default Main;