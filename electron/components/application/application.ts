import Manager from "../manager/manager";
import WindowsManager from "./WindowsManager/WindowsManager";
import listeners from "./listenersRouters/listenersRouters";
import { app, App, ipcMain } from "electron";
import Store from "electron-store";
import WindowsChannels from "../../interfaces/IpcChannels/WindowsChannels";

class Application {
  object: App;
  windowsManager: WindowsManager;
  secretKey: string | null;

  constructor() {
    this.object = app;
    this.windowsManager = new WindowsManager();

    this.object.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
        process.exit(1);
      }
    })
  }

  async start(cb: Function) {
    app.on("ready", async () => {
      const store = new Store();
      const secretKey = store.get("secretKey", null);

      this.windowsManager.createMain();

      if (secretKey) {
        this.windowsManager.mainWindow?.webContents.send(WindowsChannels.GET_SECRET_KEY);
        ipcMain.once(WindowsChannels.GET_SECRET_KEY, (event, key) => {
          this.secretKey = key;
          Manager.Load();
        });
      }


      listeners();
      cb();
    });
  }

  sendToMain(channel: string, content: any) {
    if (this.windowsManager.mainWindow)
      this.windowsManager.mainWindow.webContents.send(channel, content);
  }
}

export default new Application();
