import downloadImage from "../../someFuncs/downloadImage";
import fs from "fs/promises";
import puppeteerDefault, { Browser, Page } from "puppeteer";
import puppeteer from "puppeteer-extra";
import puppeteerStealth from "puppeteer-extra-plugin-stealth";
puppeteer.use(require("puppeteer-extra-plugin-minmax")());
puppeteer.use(puppeteerStealth());
import SteamAccountInterface from "../../../interfaces/SteamAccount/SteamAccountInterface";
import Manager from "../../manager/manager";
import application from "../../application/application";
import SteamAccountChannels from "../../../interfaces/IpcChannels/SteamAccountChannels";
import path from "path";
import LocalState from "./LocalState";
const chromium = require('chromium');
const sharp = require("sharp");

export default class Chrome {
  profileDir: string;
  params: SteamAccountInterface;
  browser: Browser | null;
  page: Page | null;
  proxy: { server: string; username: string; password: string } | undefined;
  workStatus: "working" | "notworking" | "load";
  isOpen: boolean;

  constructor(params: SteamAccountInterface) {
    this.isOpen = false;
    this.workStatus = "notworking";
    this.params = params;
    this.profileDir = path
      .join(__dirname, `./browser_profiles/${params.id}`)
      .replaceAll("\\", "/");
    this.browser = null;
    this.page = null;
    this.proxy = undefined;
  }
  createProfile(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        await fs.mkdir(`${this.profileDir}/Default`, { recursive: true });
        await fs.mkdir(`${this.profileDir}/Avatars`, { recursive: true });
        await fs.writeFile(
          `${this.profileDir}/Local State`,
          LocalState(this.params.secondary.nickname)
        );
        await downloadImage(
          this.params.secondary.avatarUrl,
          `${this.profileDir}/Avatars/avatar_generic_small.png`
        );
        await sharp(`${this.profileDir}/Avatars/avatar_generic_small.png`)
          .resize(192, 192)
          .toFile(`${this.profileDir}/Avatars/avatar_generic.png`, () => {
            resolve();
          });
      } catch (err) {
        return reject(err);
      }
    });
  }
  setupProxy(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        const links = Manager.GetSteamAccountLinkedData(this.params.id);
        if (links.proxy) {
          this.proxy = {
            server: `${links.proxy.host}:${links.proxy.port}`,
            username: links.proxy.username,
            password: links.proxy.password,
          };
        }
        resolve();
      } catch (err) {
        return reject(err);
      }
    });
  }
  start(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        console.log("path: ", chromium.path);
        this.workStatus = "load";
        application.sendToMain(SteamAccountChannels.GET_BROWSER_STARTUS, {
          status: this.workStatus,
          id: this.params.id,
        });
        await fs.access(this.profileDir).catch(async (err) => {
          if (err.code == "ENOENT") await this.createProfile();
          else return reject(err);
        });
        await this.setupProxy();

        this.browser = await puppeteer.launch({
          userDataDir: this.profileDir,
          headless: false,
          executablePath: chromium.path,
          args: this.generateChromeFlags(),
        });

        this.workStatus = "working";
        application.sendToMain(SteamAccountChannels.GET_BROWSER_STARTUS, {
          status: this.workStatus,
          id: this.params.id,
        });

        this.browser.on("disconnected", () => {
          this.workStatus = "notworking";
          application.sendToMain(SteamAccountChannels.GET_BROWSER_STARTUS, {
            status: this.workStatus,
            id: this.params.id,
          });
        });

        this.page = await this.browser.newPage();
        if (this.proxy)
          await this.page.authenticate({
            username: this.proxy?.username,
            password: this.proxy?.password,
          });
        if (this.params.useSteamCookies) this.addSteamCookies();
        await this.page.goto("https://pinkest.dev/trademanager/start-page");
      } catch (err) {
        return reject(err);
      }
    });
  }
  generateChromeFlags() {
    const args: string[] = [];
    //args.push(`--user-data-dir=${this.profileDir}`);
    //args.push('--app=https://www.google.com/');
    args.push(`--window-size=1920,1080`);
    args.push(`--gaia-profile-info`);
    args.push(`--no-default-browser-check`);
    args.push(`--suppress-message-center-popups`);

    if (this.proxy) args.push(`--proxy-server=${this.proxy?.server}`);
    console.log(args);
    return args;
  }
  async focus() {
    try {
      const newPage = await this.browser?.newPage();
      await newPage?.goto("https://pinkest.dev");
      await (newPage as any).minimize();
      await (newPage as any).maximize();
    } catch (err) {
      console.log(err);
    }
  }
  stop(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        if (this.browser) await this.browser.close();
        this.isOpen = false;
        this.workStatus = "notworking";
        application.sendToMain(SteamAccountChannels.GET_BROWSER_STARTUS, {
          status: this.workStatus,
          id: this.params.id,
        });
        resolve();
      } catch (err) {
        return reject(err);
      }
    });
  }
  addSteamCookies(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const steamLoginSecure = this.params.maFile.Session.SteamLoginSecure;
        const cookies = [
          {
            url: "https://store.steampowered.com/",
            name: "steamLoginSecure",
            value: steamLoginSecure,
          },
          {
            url: "https://steamcommunity.com/",
            name: "steamLoginSecure",
            value: steamLoginSecure,
          },
        ];
        await this.page?.setCookie(...cookies);

        resolve();
      } catch (err) {
        return reject(err);
      }
    });
  }
}
