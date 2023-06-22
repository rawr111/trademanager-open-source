import crypto from 'crypto';
import application from '../application/application';
import Store from "electron-store";
import Manager from '../manager/manager';

export const testCrypto = (secretKey: string) => {
    const store = new Store();

    const encryptedtestString = store.get('test-string-encrypted', "") as string;
    const testString = store.get('test-string', "") as string;
    if (!encryptedtestString || !testString) {
        return false;
    }

    const [encryptedString, iv] = encryptedtestString.split(':');

    const decipher = crypto.createDecipheriv('aes-256-ctr', secretKey, Buffer.from(iv, 'hex'));

    let decrypted = decipher.update(encryptedString, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');

    if (decrypted == testString) {
        return true;
    } else {
        return false;
    }
}

export const setCrypto = (key: string) => {
    const store = new Store();
    const steamAccounts = store.get("steamAccounts", {});
    const proxies = store.get("proxies", {});

    application.secretKey = key;

    const encryptedSteamAccounts = encryptObject(steamAccounts);
    const encryptedProxies = encryptObject(proxies);

    store.set("steamAccounts", encryptedSteamAccounts);
    store.set("proxies", encryptedProxies);
    store.set("test-string-encrypted", encrypt("test-string_123"));
    store.set("secretKey", true);

    Manager.Load();
}

const getHashedKey = (key: string) => {
    return crypto.createHash('sha256').update(key).digest();
}

const encrypt = (text: string) => {
    return text;
    // if (application.secretKey) {
    //     const iv = crypto.randomBytes(16);

    //     const cipher = crypto.createCipheriv('aes-256-ctr', getHashedKey(application.secretKey), iv);

    //     let encrypted = cipher.update(text, 'utf-8', 'hex');
    //     encrypted += cipher.final('hex');

    //     return `${encrypted}:${iv.toString('hex')}`;
    // } else {
    //     return text;
    // }
}

const decrypt = (text: string) => {
    return text;
    // if (application.secretKey) {
    //     const [encryptedString, iv] = text.split(':');

    //     const decipher = crypto.createDecipheriv('aes-256-ctr', getHashedKey(application.secretKey), Buffer.from(iv, 'hex'));

    //     let decrypted = decipher.update(encryptedString, 'hex', 'utf-8');
    //     decrypted += decipher.final('utf-8');

    //     return decrypted;
    // } else {
    //     return text;
    // }
}

const encryptObject = (obj: any) => {
    return obj;
    // if (!application.secretKey) return obj;

    // const newObject: any = {};

    // for (var prop in obj) {
    //     if (obj[prop] === null) {
    //         continue;
    //     }
    //     if (typeof (obj[prop]) === 'object') {
    //         newObject[prop] = encryptObject(obj[prop]);
    //         continue;
    //     }
    //     if (typeof (obj[prop]) === 'string') {
    //         newObject[prop] = encrypt(obj[prop]);
    //         continue;
    //     }
    //     newObject[prop] = obj[prop];
    // }
    // return newObject;
}

const decryptObject = (obj: any) => {
    return obj;
    // if (!application.secretKey) return obj;

    // const newObject: any = {};

    // for (var prop in obj) {
    //     if (obj[prop] === null) {
    //         continue;
    //     }
    //     if (typeof (obj[prop]) === 'object') {
    //         newObject[prop] = decryptObject(obj[prop]);
    //         continue;
    //     }
    //     if (typeof (obj[prop]) === 'string') {
    //         newObject[prop] = decrypt(obj[prop]);
    //         continue;
    //     }
    //     newObject[prop] = obj[prop];
    // }
    // return newObject;
}

export default { encrypt, decrypt, encryptObject, decryptObject, testCrypto };