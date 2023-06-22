import SteamAccountChannels from "../../../interfaces/IpcChannels/SteamAccountChannels";
import CreationStepType from "../../../interfaces/SteamAccount/CreationStepType";
import application from "../../application/application";

export default (step: CreationStepType) => {
    application.sendToMain(SteamAccountChannels.STEAM_ACCOUNT_CREATE_PROCESS_STEP, step);
}