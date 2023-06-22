type CreationStepType =
    "start" |
    "error" |
    "checkLoginStatus" |
    "loadData" |
    "creation" |
    "askPin" |
    "tryPin" |
    "oAuthLogin" |
    "loginByPassword" |
    "getApiKey" |
    "testLogin" |
    "enableTwoFactor" |
    "finalizeTwoFactor" |
    "import" |
    "link" |
    "askEmailCode" |
    "tryEmailCode" |
    "askSmsCode" |
    "trySmsCode" |
    "end";

export default CreationStepType;