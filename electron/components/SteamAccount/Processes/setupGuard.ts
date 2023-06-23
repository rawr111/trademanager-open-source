import SteamTotp from "steam-totp";
import { ipcMain } from "electron";
import SteamCommunity from "steamcommunity";
import CreationStepType from "../../../interfaces/SteamAccount/CreationStepType";
import MaFileInterface from "../../../interfaces/SteamAccount/MaFileInterface";
import SmaFileInterface from "../../../interfaces/SteamAccount/SmaFileInterface";
import application from "../../application/application";
import askSmsCode from "../../application/askInfo/askSmsCode";
import askMailCode from "../../application/askInfo/askMailCode";
import convertCookiesToSession from "../../Functions/convertCookiesToSession";
import { getSecondaries } from "./loadSteamAccountData";
import { v4 as uuidv4 } from "uuid";
import TwoFactorResponseInterface from "../../../interfaces/SteamAccount/TwoFactorResponseInterface";
import ProxySetupInterface from "../../../interfaces/Proxy/ProxySetupInterface";
import request from "request";
import SteamAccountChannels from "../../../interfaces/IpcChannels/SteamAccountChannels";
import SteamAccountSetupInterface from "../../../interfaces/SteamAccount/SteamAccountSetupInterface";
import {
  LoginSession,
  EAuthTokenPlatformType,
  EAuthSessionGuardType,
} from "steam-session";

type AbortChannelType =
  | SteamAccountChannels.STEAM_ACCOUNT_CREATE_PROCESS_ABORT
  | SteamAccountChannels.GUARD_SETUP_PROCESS_ABORT;
type StepType =
  | SteamAccountChannels.STEAM_ACCOUNT_CREATE_PROCESS_STEP
  | SteamAccountChannels.GUARD_SETUP_PROCESS_STEP;

export default async function setupGuard(
  steamAccountParams: {
    accountName: string;
    password: string;
    tmApiKey?: string;
  },
  proxy?: ProxySetupInterface
): Promise<SmaFileInterface> {
  return new Promise(async (resolve, reject) => {
    let community = new SteamCommunity();
    if (proxy) {
      const proxyRequest = request.defaults({
        proxy: `http://${proxy.username}:${proxy.password}@${proxy.host}:${proxy.port}`,
      });
      //@ts-ignore
      community = new SteamCommunity({ request: proxyRequest });
    }
    const EResult = SteamCommunity.EResult;

    ipcMain.on("ABORT_SETUP_GUARD", () => {
      reject("abort");
    });

    const nextStep = (step: CreationStepType) => {
      application.sendToMain("GUARD_SETUP_STEP", step);
    };

    const doLogin = (
      accountName: string,
      password: string
    ): Promise<MaFileInterface> => {
      return new Promise<MaFileInterface>((resolve, reject) => {
        nextStep("loginByPassword");
        const session = new LoginSession(EAuthTokenPlatformType.MobileApp);
        session
          .startWithCredentials({
            accountName,
            password,
          })
          .then(async ({ actionRequired, validActions }) => {
            if (actionRequired) {
              if (validActions) {
                const emailPromt = validActions
                  .filter(
                    (action) => action.type === EAuthSessionGuardType.EmailCode
                  )
                  .pop();
                const guardPromt = validActions
                  .filter(
                    (action) => action.type === EAuthSessionGuardType.DeviceCode
                  )
                  .pop();
                if (guardPromt) {
                  return reject(
                    new Error(
                      "This account already has two-factor authentication enabled."
                    )
                  );
                } else if (emailPromt) {
                  console.log(
                    `An email has been sent to your address at ${emailPromt.detail}`
                  );
                  const promtEmailCode = async () => {
                    nextStep("askEmailCode");
                    const code = await askMailCode(
                      uuidv4(),
                      steamAccountParams.accountName
                    );
                    nextStep("tryEmailCode");
                    try {
                      await session.submitSteamGuardCode(code);
                    } catch (error) {
                      if (error.message === "InvalidLoginAuthCode") {
                        await promtEmailCode();
                      } else {
                        throw error;
                      }
                    }
                  };
                  await promtEmailCode();
                } else {
                  return reject(
                    `Failed to log in, action required: ${validActions}`
                  );
                }
              }
            }
          })
          .catch((error) => {
            return reject(error);
          });
        session.on("authenticated", async () => {
          const cookies = await session.getWebCookies();
          community.setCookies(cookies);
          community.loggedIn((error, loggedIn, familyView) => {
            if (error) throw error;
            if (!loggedIn) throw new Error("Not logged in");
            if (familyView) throw new Error("Family view");
            //@ts-ignore
            community.setMobileAppAccessToken(session.accessToken);
            community.enableTwoFactor(async (err, response) => {
              nextStep("enableTwoFactor");
              if (err) {
                if (err.eresult == EResult.Fail) {
                  return reject(
                    new Error(
                      "Failed to enable two-factor authentication. Perhaps the phone number is not attached."
                    )
                  );
                }
                if (err.eresult == EResult.RateLimitExceeded) {
                  return reject(
                    new Error("RateLimitExceeded. Try again later.")
                  );
                }
                return reject(err);
              }
              if (response.status != EResult.OK) {
                return reject(new Error(`Status ${response.status}`));
              }
              //@ts-ignore
              const rawMaFile: TwoFactorResponseInterface = response;
              console.log(rawMaFile);
              const promtSmsCode = async (
                rawMaFile: TwoFactorResponseInterface
              ) => {
                nextStep("askSmsCode");
                const code = await askSmsCode(
                  uuidv4(),
                  steamAccountParams.accountName
                );
                nextStep("trySmsCode");
                console.log("try sms: " + code);
                try {
                  await new Promise<void>((resolve, reject) => {
                    community.finalizeTwoFactor(
                      response.shared_secret,
                      code,
                      (error) => {
                        if (error) return reject(error);
                        resolve();
                      }
                    );
                  });
                } catch (error) {
                  if (error.message == "Invalid activation code") {
                    await promtSmsCode(rawMaFile);
                  } else {
                    return reject(error);
                  }
                }
              };
              await promtSmsCode(rawMaFile);
              const maFile: MaFileInterface = {
                ...rawMaFile,
                Session: convertCookiesToSession(cookies),
                device_id: SteamTotp.getDeviceID(session.steamID),
                fully_enrolled: true,
              };
              maFile.Session.SteamID = session.steamID.toString();
              console.log(maFile);
              resolve(maFile);
            });
          });
        });
      });
    };

    doLogin(steamAccountParams.accountName, steamAccountParams.password)
      .then((maFile) => {
        nextStep("loadData");
        getSecondaries(community)
          .then((secondaries) => {
            const sMaFile: SmaFileInterface = {
              accountName: steamAccountParams.accountName,
              password: steamAccountParams.password,
              tmApiKey: steamAccountParams.tmApiKey,
              maFile: maFile,
              secondary: secondaries,
              familyViewPin: null,
              useSteamCookies: true,
            };
            console.log(sMaFile);
            resolve(sMaFile);
          })
          .catch((err) => {
            reject(err);
          });
      })
      .catch((err) => {
        reject(err);
      });
  });
}
