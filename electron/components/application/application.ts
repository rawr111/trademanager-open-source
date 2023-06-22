import Manager from "../manager/manager";
import WindowsManager from "./WindowsManager/WindowsManager";
import listeners from "./listenersRouters/listenersRouters";
import { app, App, ipcMain } from "electron";
import Store from "electron-store";
import WindowsChannels from "../../interfaces/IpcChannels/WindowsChannels";
import { testCrypto } from "../newStorage/cryptoUserData";

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

  firstStage(cb: () => void) {
    app.on("ready", async () => {
      this.windowsManager.createMain();
      //this.decrypt(cb);
      this.secondStage(cb);
    });
  }

  decrypt(cb: () => void) {
    const store = new Store();
    const secretKey = store.get("secretKey", null);

    if (secretKey) {
      this.windowsManager.mainWindow?.webContents.send(WindowsChannels.GET_SECRET_KEY);
      ipcMain.once(WindowsChannels.GET_SECRET_KEY, (event, key) => {
        if (testCrypto(key)) {
          this.secretKey = key;
          this.secondStage(cb);
        } else {
          this.decrypt(cb);
        }
      });
    } else {
      this.secondStage(cb);
    }
  }

  secondStage(cb: () => void) {
    Manager.Load();
    listeners();
    cb();
  }

  sendToMain(channel: string, content: any) {
    if (this.windowsManager.mainWindow)
      this.windowsManager.mainWindow.webContents.send(channel, content);
  }
}

export default new Application();
