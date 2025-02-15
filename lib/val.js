const chzzkAPIURL = "https://openapi.chzzk.naver.com/";
const chzzkBaseURL = "https://api.chzzk.naver.com/";
const gameBaseURL = "https://comm-api.game.naver.com/";
const naverBaseURL = "https://apis.naver.com/";

const state = "zxclDasdfA25";

let NID = {
    AUT: null,
    SES: null
}

let AUTH = {
    id: null,
    secret: null
}

/**
 * @param {string} NID_AUT
 * @param {string} NID_SES
 */
function login (NID_AUT, NID_SES) {
    NID.AUT = NID_AUT;
    NID.SES = NID_SES;
}

/**
 * @param {string} ClientID
 * @param {string} ClientSecret
 */
function auth (ClientID, ClientSecret) {
    AUTH.id = ClientID;
    AUTH.secret = ClientSecret;
}

module.exports = {
    chzzkAPIURL: chzzkAPIURL,
    chzzkBaseURL: chzzkBaseURL,
    gameBaseURL: gameBaseURL,
    naverBaseURL: naverBaseURL,
    state: state,
    NID: NID,
    AUTH: AUTH,
    login: login,
    auth: auth
}