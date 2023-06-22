const JSONbig = require('json-bigint');

const readFile = (file: File): Promise<any> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => {
            if (typeof (reader.result) === 'string') {
                let maFile = reader.result.replaceAll(" ", "");
                const json = JSONbig.parse(maFile);
                resolve(json);
            }
            reject('file is not string');
        }
        reader.onerror = (err) => {
            console.log(err);
            reject(err);
        }
    });
}

export default readFile;