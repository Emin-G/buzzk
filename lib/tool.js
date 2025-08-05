const { chzzkAPIURL, chzzkBaseURL, gameBaseURL, naverBaseURL, NID, AUTH } = require("./val.js");
const vm = require("./vm.js");

const axios = require("axios");

function clientGet (path) {
    return new Promise(async (resolve, reject) => {

        axios({
            method: "GET",
            url: chzzkAPIURL + path,
            headers: {
                "Client-Id": AUTH.id,
                "Client-Secret": AUTH.secret,
                "Content-Type": "application/json",
                "User-Agent": "BuzzkLib/" + vm.getVersion() + " (Node)"
            }
        })

        .then((response) => {
            return resolve(response.data);
        })
        
        .catch((error) => {
            return resolve({"code": 500});
        });

    });
}

function clientPost (path, body) {
    return new Promise(async (resolve, reject) => {

        axios({
            method: "POST",
            url: chzzkAPIURL + path,
            headers: {
                "Client-Id": AUTH.id,
                "Client-Secret": AUTH.secret,
                "Content-Type": "application/json",
                "User-Agent": "BuzzkLib/" + vm.getVersion() + " (Node)"
            },
            data: body
        })

        .then((response) => {
            return resolve(response.data);
        })
        
        .catch((error) => {
            return resolve({"code": 500});
        });

    });
}

function userGet (token, path) {
    return new Promise(async (resolve, reject) => {

        axios({
            method: "GET",
            url: chzzkAPIURL + path,
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json",
                "User-Agent": "BuzzkLib/" + vm.getVersion() + " (Node)"
            }
        })

        .then((response) => {
            return resolve(response.data);
        })
        
        .catch((error) => {
            return resolve({"code": 500});
        });

    });
}

function userPost (token, path, body) {
    return new Promise(async (resolve, reject) => {

        axios({
            method: "POST",
            url: chzzkAPIURL + path,
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json",
                "User-Agent": "BuzzkLib/" + vm.getVersion() + " (Node)"
            },
            data: body
        })

        .then((response) => {
            return resolve(response.data);
        })
        
        .catch((error) => {
            return resolve({"code": 500});
        });

    });
}

function reqChzzk (path) {
    return new Promise(async (resolve, reject) => {

        axios({
            method: "GET",
            url: chzzkBaseURL + path,
            headers: {
                "Cookie": "NID_AUT=" + NID.AUT + ";NID_SES=" + NID.SES,
                "User-Agent": "BuzzkLib/" + vm.getVersion() + " (Node)"
            }
        })

        .then((response) => {
            return resolve(response.data);
        })
        
        .catch((error) => {
            return resolve({"code": 500});
        });

    });
}

function exChzzk (method, path) {
    return new Promise(async (resolve, reject) => {

        axios({
            method: method,
            url: chzzkBaseURL + path,
            headers: {
                "Cookie": "NID_AUT=" + NID.AUT + ";NID_SES=" + NID.SES,
                "User-Agent": "BuzzkLib/" + vm.getVersion() + " (Node)"
            }
        })

        .then((response) => {
            return resolve(response.data);
        })
        
        .catch((error) => {
            console.log(error);
            return resolve({"code": 500});
        });

    });
}

function reqGame (path) {
    return new Promise(async (resolve, reject) => {

        axios({
            method: "GET",
            url: gameBaseURL + path,
            headers: {
                "User-Agent": "BuzzkLib/" + vm.getVersion() + " (Node)"
            }
        })

        .then((response) => {
            return resolve(response.data);
        })
        
        .catch((error) => {
            return resolve({"code": 500});
        });

    });
}

function reqNaver (path) {
    return new Promise(async (resolve, reject) => {

        axios({
            method: "GET",
            url: naverBaseURL + path,
            headers: {
                "User-Agent": "BuzzkLib/" + vm.getVersion() + " (Node)"
            }
        })

        .then((response) => {
            return resolve(response.data);
        })
        
        .catch((error) => {
            return resolve({"code": 500});
        });

    });
}

module.exports = {
    CLIENT: {
        get: clientGet,
        post: clientPost
    },
    USER: {
        get: userGet,
        post: userPost
    },
    reqChzzk: reqChzzk,
    exChzzk: exChzzk,
    reqGame: reqGame,
    reqNaver: reqNaver
}