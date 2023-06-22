import fs from 'fs';

const isFileExist = (path: string) => {
    return new Promise((resolve, reject) => {
        try {
            fs.exists(path, (exist) => {
                resolve(exist); 
             });
        } catch (err){
            reject(err);
        }
    });
}

export default isFileExist;