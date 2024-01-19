const { chzzkBaseURL, gameBaseURL, NID } = require("./val.js");

function reqChzzk (path) {
    return new Promise(async (resolve, reject) => {

        fetch(chzzkBaseURL + path, {
            method: "GET",
            headers: {
                "Cookie": "NID_AUT=" + NID.AUT + ";NID_SES=" + NID.SES
            }
        })

        .then((response) => resolve(response.json()))
        .then((data) => console.log(data));
        
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

        .then((response) => resolve(response.json()))
        .then((data) => console.log(data));
        
    });
}

module.exports = {
    reqChzzk: reqChzzk,
    reqGame: reqGame
}