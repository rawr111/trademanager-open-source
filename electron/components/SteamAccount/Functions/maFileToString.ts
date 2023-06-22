import MaFileInterface from "../../interfaces/SteamAccount/MaFileInterface";

const maFileToString = (maFile: MaFileInterface): string => {
    let text = JSON.stringify(maFile);
    const pos1 = text.indexOf('"SteamID"') + '"SteamID"'.length;
    const pos2 = text.indexOf('"', pos1) + 1;
    const pos3 = text.indexOf('"', pos2);

    text = removeStringElement(text, pos2);
    text = removeStringElement(text, pos3);

    return text;
}

const removeStringElement = (str: string, index: number) => {
    const firstPart = str.slice(0, index - 1);
    const secondPart = str.slice(index);
    return firstPart + secondPart;
}

export default maFileToString;