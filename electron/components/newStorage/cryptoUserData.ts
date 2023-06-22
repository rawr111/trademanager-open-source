import crypto from 'crypto';

const encrypt = (text: string) => {
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv('aes-256-ctr', 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3', iv);

    let encrypted = cipher.update(text, 'utf-8', 'hex');
    encrypted += cipher.final('hex');

    return `${encrypted}:${iv.toString('hex')}`;
}

const decrypt = (text: string) => {
    const [encryptedString, iv] = text.split(':');

    const decipher = crypto.createDecipheriv('aes-256-ctr', 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3', Buffer.from(iv, 'hex'));

    let decrypted = decipher.update(encryptedString, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');

    return decrypted;
}

const encryptObject = (obj: any) => {
    const newObject: any = {};

    for (var prop in obj) {
        if (obj[prop] === null){
            continue;
        }
        if (typeof (obj[prop]) === 'object') {
            newObject[prop] = encryptObject(obj[prop]);
            continue;
        }
        if (typeof (obj[prop]) === 'string') {
            newObject[prop] = encrypt(obj[prop]);
            continue;
        }
        newObject[prop] = obj[prop];
    }
    return newObject;
}

const decryptObject = (obj: any) => {
    const newObject: any = {};

    for (var prop in obj) {
        if (obj[prop] === null){
            continue;
        }
        if (typeof (obj[prop]) === 'object') {
            newObject[prop] = decryptObject(obj[prop]);
            continue;
        }
        if (typeof (obj[prop]) === 'string') {
            newObject[prop] = decrypt(obj[prop]);
            continue;
        }
        newObject[prop] = obj[prop];
    }
    return newObject;
}

export default { encrypt, decrypt, encryptObject, decryptObject };