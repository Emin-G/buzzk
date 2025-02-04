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

        .then(async (response) => {
            let json;
            try {
                json = await response.json();
            }

            catch(error) {
                return resolve({"code": 500});
            }

            return resolve(json);
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

        .then(async (response) => {
            let json;
            try {
                json = await response.json();
            }

            catch(error) {
                return resolve({"code": 500});
            }

            return resolve(json);
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

        .then(async (response) => {
            let json;
            try {
                json = await response.json();
            }

            catch(error) {
                return resolve({"code": 500});
            }

            return resolve(json);
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

        .then(async (response) => {
            let json;
            try {
                json = await response.json();
            }

            catch(error) {
                return resolve(null);
            }

            return resolve(json);
        });
    });
}

module.exports = {
    reqChzzk: reqChzzk,
    exChzzk: exChzzk,
    reqGame: reqGame,
    reqNaver: reqNaver
}