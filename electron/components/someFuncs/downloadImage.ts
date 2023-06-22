import request from "request";
import fs from 'fs';

const download = (uri: string, filename: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        request.head(uri, (err, res, body) => {
            request(uri).pipe(fs.createWriteStream(filename)).on('close', () => {
                resolve();
            });
        });
    });
};

export default download;