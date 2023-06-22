export default (value: string) => {
    let host = "";
    try {
        host = value.split('@')[1].split(':')[0];
        if (!host) host = "";
    } catch (err) {
        host = "";
    }

    let port = "";
    try {
        port = value.split('@')[1].split(':')[1];
        if (!port) port = "";
    } catch (err) {
        port = "";
    }

    let username = "";
    try {
        username = value.split('@')[0].split(':')[0];
        if (!username) username = "";
    } catch (err) {
        username = "";
    }

    let password = "";
    try {
        password = value.split('@')[0].split(':')[1];
        if (!password) password = "";
    } catch (err) {
        password = "";
    }
    return { username, password, host, port };
}