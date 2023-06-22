export default interface SessionInterface {
    SessionID: string;
    SteamLogin: string | null;
    SteamLoginSecure: string;
    WebCookie: string;
    SteamID: string;
    SteamRememberLogin: string;
}