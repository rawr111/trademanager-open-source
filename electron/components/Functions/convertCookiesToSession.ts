import SessionInterface from "../../interfaces/SteamAccount/SessionInterface";

export default (cookies: string[], steamLogin?: string | null): SessionInterface => {
    try {
        const session: SessionInterface = {
            SessionID: "",
            SteamLogin: steamLogin ? steamLogin : null,
            SteamLoginSecure: "",
            WebCookie: "",
            SteamID: "",
            SteamRememberLogin: ""
        };
        for (var cookie of cookies) {
            try {
                if (cookie.match(/sessionid=/g)) session.SessionID = cookie.match(/[0-9A-Z]{24}/gi)![0];
                if (cookie.match(/steamMachineAuth7/g)) session.WebCookie = cookie.match(/[0-9A-Z]{40}/gi)![0];
                if (!steamLogin && cookie.match(/steamLogin=/g)) session.SteamLogin = cookie.split('=')[1];
                if (cookie.match(/steamLoginSecure/g)) session.SteamLoginSecure = cookie.split('=')[1];
                if (cookie.match(/steamMachineAuth7/g)) session.SteamID = cookie.match(/[0-9]{17}/gi)![0];
                if (cookie.match(/steamRememberLogin=/g)) session.SteamRememberLogin = cookie.split('=')[1];
            } catch (err) {

            }
        }
        return session;
    } catch (err) {
        console.log(cookies, steamLogin);
        throw new Error(`Cant convert cookies to session!`);
    }
}