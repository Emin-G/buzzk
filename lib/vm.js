const axios = require("axios");

function getVersion () {
    let localPkg = require("../package.json");
    return localPkg.version;
}

async function check () {
    let localPkg = require("../package.json");
    let remotePkg = await axios.get("https://raw.githubusercontent.com/Emin-G/buzzk/master/package.json").catch((error) => {
        return;
    });
    if (!remotePkg || remotePkg.status != 200) return console.log("[BUZZK] 최신 버전에 대한 정보를 불러오지 못했습니다.");

    remotePkg = remotePkg.data;

    localPkg = String(localPkg.version).split(".");
    remotePkg = String(remotePkg.version).split(".");

    for (let v in remotePkg) {
        if (parseInt(remotePkg[v]) > parseInt(localPkg[v])) return console.log("[BUZZK] 새로운 버전을 찾았습니다! ( npm install buzzk@" + remotePkg.join(".") + " )");
    }
}

check();

module.exports = {
    getVersion: getVersion
}