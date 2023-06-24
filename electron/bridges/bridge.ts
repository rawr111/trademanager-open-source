import mainApi from './mainBridge';
import confirmationsApi from './confirmationsBridge';
import askFamilyPinApi from './askFamilyPinBridge';
import errorApi from './errorWindowBridge';

export default {
    mainApi: mainApi,
    confirmationsApi: confirmationsApi,
    askFamilyPinApi: askFamilyPinApi,
    errorApi: errorApi
};