import react, { FC, useEffect } from "react";
import { observer } from "mobx-react";
import ProxiesTable from "./components/ProxiesTable";
import ProxiesPanel from "./components/ProxiesPanel";
import ProxiesFooter from "./components/ProxiesFooter";
import store from "../../../../store/store";
import TableSettings from "../../../../globalComponents/TableSettings/TableSettings";
import ProxiesEditingForm from "./components/ProxiesEditingForm/ProxiesEditingForm";
import ProxiesCreationForm from "./components/ProxiesCreationForm/ProxiesCreationForm";

const ProxiesTab: FC = observer(() => {
  return (
    <>
      <div className="main">
        <ProxiesPanel />
        <ProxiesTable />
        <ProxiesFooter />
      </div>
      <ProxiesCreationForm />
      <ProxiesEditingForm />
      <TableSettings
        isOpen={store.proxiesTable.isSettingsFormOpen}
        fields={store.proxiesTable.getDefaultFields()}
        currentFields={store.proxiesTable.getCustomizableFields()}
        onClose={() => {
          store.proxiesTable.closeTableSettings();
        }}
        onSave={(newFields) => {
          store.proxiesTable.setFields(newFields);
          store.proxiesTable.saveFields(newFields);
          store.proxiesTable.closeTableSettings();
        }}
      />
    </>
  );
});

export default ProxiesTab;
