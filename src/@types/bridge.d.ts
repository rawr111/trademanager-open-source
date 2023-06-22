import bridge from '../../electron/bridges/bridge';

declare global {
  // eslint-disable-next-line
  interface Window {
    Main: typeof bridge.mainApi,
    Confirmations: typeof bridge.confirmationsApi,
    AskFamilyPin: typeof bridge.askFamilyPinApi,
    Auth: typeof bridge.authApi,
    ErrorWindow: typeof bridge.errorApi,
    getWindowName: () => string
  }
}
