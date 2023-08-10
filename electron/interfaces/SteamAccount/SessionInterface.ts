interface SessionInterface {
    SessionID?: string;
    SteamLogin?: string | null;
    SteamLoginSecure?: string;
    WebCookie?: string;
    SteamID?: string;
    SteamRememberLogin?: string;
}

interface SessionInterface {
    SteamID?: string;
    AccessToken?: string;
    RefreshToken?: string;
    SessionID?: string;
}

export default SessionInterface;