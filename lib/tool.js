const { chzzkAPIURL, chzzkBaseURL, gameBaseURL, naverBaseURL, NID, AUTH } = require("./val.js");
const vm = require("./vm.js");

function clientGet (path) {
    return new Promise(async (resolve, reject) => {

        fetch(chzzkAPIURL + path, {
            method: "GET",
            headers: {
                "Client-Id": AUTH.id,
                "Client-Secret": AUTH.secret,
                "Content-Type": "application/json",
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

function clientPost (path, body) {
    return new Promise(async (resolve, reject) => {

        fetch(chzzkAPIURL + path, {
            method: "POST",
            headers: {
                "Client-Id": AUTH.id,
                "Client-Secret": AUTH.secret,
                "Content-Type": "application/json",
                "User-Agent": "BuzzkLib/" + vm.getVersion() + " (Node)"
            },
            body: body
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

function userGet (token, path) {
    return new Promise(async (resolve, reject) => {

        fetch(chzzkAPIURL + path, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json",
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

function userPost (token, path, body) {
    return new Promise(async (resolve, reject) => {

        fetch(chzzkAPIURL + path, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json",
                "User-Agent": "BuzzkLib/" + vm.getVersion() + " (Node)"
            },
            body: body
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

function reqChzzk (path) {
    return new Promise(async (resolve, reject) => {

        fetch(chzzkBaseURL + path, {
            method: "GET",
            headers: {
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

function reqNaver (path) {
    return new Promise(async (resolve, reject) => {

        fetch(naverBaseURL + path, {
            method: "GET",
            headers: {
                "User-Agent": "BuzzkLib/" + vm.getVersion() + " (Node)"
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