import fs from 'fs/promises';
import isFileExist from './isFileExist';

const createFolder = async (path: string) => {
    const isExist = await isFileExist(path);
    if (!isExist){
        await fs.mkdir(path);
    }
}

export default createFolder;