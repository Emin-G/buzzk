async function check () {

    let localPkg = require("../package.json");
    let remotePkg = await fetch("https://raw.githubusercontent.com/Emin-G/buzzk/master/package.json");

    if (remotePkg.status != 200) return console.log("[BUZZK] 최신 버전에 대한 정보를 불러오지 못했습니다.");

    remotePkg = await remotePkg.json();

    localPkg = String(localPkg.version).split(".");
    remotePkg = String(remotePkg.version).split(".");

    for (let v in remotePkg) {
        if (parseInt(remotePkg[v]) > parseInt(localPkg[v])) return console.log("[BUZZK] 새로운 버전을 찾았습니다! ( npm install buzzk@" + remotePkg.join(".") + " )");
    }
}

check();