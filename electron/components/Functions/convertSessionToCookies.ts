import Session from "../../interfaces/SteamAccount/SessionInterface";

export default (session: Session): string[] => {
    try {
        var cookies: string[] = [
            `sessionid=${session.SessionID}`,
            `steamLoginSecure=${session.SteamLoginSecure}`,
            `steamMachineAuth${session.SteamID}=${session.WebCookie}`,
            `steamRememberLogin=${session.SteamRememberLogin}`
        ];
        if (session.SteamLogin)
            cookies.push(`steamLogin=${session.SteamLogin}`);
        console.log(cookies);
        return cookies;
    } catch (err){
        console.log(session);
        throw new Error(`Cant convert session to cookies!`);
    }
}