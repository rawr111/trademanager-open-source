import MaFileInterface from "../../interfaces/SteamAccount/MaFileInterface";

export default (maFile: MaFileInterface): string => {
    var maFileStr = JSON.stringify(maFile);
    const pos1 = maFileStr.indexOf('"SteamID":') + '"SteamID":'.length;
    const pos2 = maFileStr.indexOf('"', pos1) + 18;
    maFileStr = maFileStr.slice(0, pos1) + maFileStr.slice(pos1 + 1, pos2) + maFileStr.slice(pos2 + 1);
    return maFileStr;
}