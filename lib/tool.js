const { chzzkBaseURL, gameBaseURL, NID } = require("./val.js");

function reqChzzk (path) {
    return new Promise(async (resolve, reject) => {

        fetch(chzzkBaseURL + path, {
            method: "GET",
            headers: {
                "Cookie": "NID_AUT=" + NID.AUT + ";NID_SES=" + NID.SES,
                "User-Agent": "BUZZK Lib (v.1.6.5, Node)"
            }
        })

        .then((response) => resolve(response.json())).catch((error) => resolve({"code": 500}));
        
    });
}

function exChzzk (method, path) {
    return new Promise(async (resolve, reject) => {

        fetch(chzzkBaseURL + path, {
            method: method,
            headers: {
                "Cookie": "NID_AUT=" + NID.AUT + ";NID_SES=" + NID.SES,
                "User-Agent": "BUZZK Lib (v.1.6.5, Node)"
            }
        })

        .then((response) => resolve(response.json())).catch((error) => resolve({"code": 500}));
        
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

        .then((response) => resolve(response.json())).catch((error) => resolve({"code": 500}));
        
    });
}

module.exports = {
    reqChzzk: reqChzzk,
    exChzzk: exChzzk,
    reqGame: reqGame
}