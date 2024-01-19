const chzzkBaseURL = "https://api.chzzk.naver.com/";
const gameBaseURL = "https://comm-api.game.naver.com/";

let NID = {
    AUT: null,
    SES: null
}

function login (NID_AUT, NID_SES) {
    NID.AUT = NID_AUT;
    NID.SES = NID_SES;
}

module.exports = {
    chzzkBaseURL: chzzkBaseURL,
    gameBaseURL: gameBaseURL,
    NID: NID,
    login: login
}