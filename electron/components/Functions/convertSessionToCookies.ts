import Session from "../../interfaces/SteamAccount/SessionInterface";

// export default (session: Session): string[] => {
//     try {
//         var cookies: string[] = [];
//         if (session.SessionID)
//             cookies.push(`sessionid=${session.SessionID}`);
//         if (session.SteamLoginSecure)
//             cookies.push(`steamLoginSecure=${session.SteamLoginSecure}`);
//         if (session.SteamID && session.WebCookie)
//             cookies.push(`steamMachineAuth${session.SteamID}=${session.WebCookie}`);
//         if (session.SteamRememberLogin)
//             cookies.push(`steamRememberLogin=${session.SteamRememberLogin}`)

//         if (session.SteamLogin)
//             cookies.push(`steamLogin=${session.SteamLogin}`);
//         console.log(cookies);
//         return cookies;
//     } catch (err) {
//         console.log(session);
//         throw new Error(`Cant convert session to cookies!`);
//     }
// }