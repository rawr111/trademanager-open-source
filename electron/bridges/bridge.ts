import mainApi from './mainBridge';
import confirmationsApi from './confirmationsBridge';
import askFamilyPinApi from './askFamilyPinBridge';
import authApi from './authBridge';
import errorApi from './errorWindowBridge';

export default {
    mainApi: mainApi,
    confirmationsApi: confirmationsApi,
    askFamilyPinApi: askFamilyPinApi,
    authApi: authApi,
    errorApi: errorApi
};