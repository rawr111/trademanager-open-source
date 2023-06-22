import WindowsManager from "./WindowsManager/WindowsManager";
import listeners from "./listenersRouters/listenersRouters";
import { app, App } from "electron";

class Application {
  object: App;
  windowsManager: WindowsManager;

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
      this.windowsManager.createMain();
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
