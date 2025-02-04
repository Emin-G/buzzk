const { chzzkBaseURL, gameBaseURL, naverBaseURL, NID } = require("./val.js");
const vm = require("./vm.js");

function reqChzzk (path) {
    return new Promise(async (resolve, reject) => {

        fetch(chzzkBaseURL + path, {
            method: "GET",
            headers: {
                "Cookie": "NID_AUT=" + NID.AUT + ";NID_SES=" + NID.SES,
                "User-Agent": "BuzzkLib/" + vm.getVersion() + " (Node)"
            }
        })

        .then((response) => {
            resolve(response.json().catch((error) => resolve({"code": 500})))
            .catch((error) => resolve({"code": 500}));
        });
    });
}

function exChzzk (method, path) {
    return new Promise(async (resolve, reject) => {

        fetch(chzzkBaseURL + path, {
            method: method,
            headers: {
                "Cookie": "NID_AUT=" + NID.AUT + ";NID_SES=" + NID.SES,
                "User-Agent": "BuzzkLib/" + vm.getVersion() + " (Node)"
            }
        })

        .then((response) => {
            resolve(response.json().catch((error) => resolve({"code": 500})))
            .catch((error) => resolve({"code": 500}));
        });
    });
}

function reqGame (path) {
    return new Promise(async (resolve, reject) => {

        fetch(gameBaseURL + path, {
            method: "GET",
            headers: {
                "Cookie": "NID_AUT=" + NID.AUT + ";NID_SES=" + NID.SES
            }
        })

        .then((response) => {
            resolve(response.json().catch((error) => resolve({"code": 500})))
            .catch((error) => resolve({"code": 500}));
        });
    });
}

function reqNaver (path) {
    return new Promise(async (resolve, reject) => {

        fetch(naverBaseURL + path, {
            method: "GET",
            headers: {
                "Cookie": "NID_AUT=" + NID.AUT + ";NID_SES=" + NID.SES
            }
        })

        .then((response) => {
            resolve(response.json().catch((error) => resolve(null)))
            .catch((error) => resolve(null));
        });
    });
}

module.exports = {
    reqChzzk: reqChzzk,
    exChzzk: exChzzk,
    reqGame: reqGame,
    reqNaver: reqNaver
}