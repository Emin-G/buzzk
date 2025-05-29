const { USER, CLIENT } = require("./tool.js");
const { AUTH, state } = require("./val.js");

const channel = require("./channel.js");

class chzzkToken {
    constructor(access, refresh, expireIn) {
        this.access = access;
        this.refresh = refresh;
        this.expireIn = expireIn;
    }
}

/**
 * @typedef {Object} chzzkChannel
 * @property {string} channelID
 * @property {string} name
 * @property {string} follower
 * @property {string} imageURL
 */

/**
 * @typedef {Object} chzzkTokenData
 * @property {string} access
 * @property {string} refresh
 * @property {string} expireIn
 */

/**
 * @param {string} code
 * @returns {Promise<chzzkTokenData>}
 */
async function get (code) {
    return new Promise(async (resolve, reject) => {
        let options = {
            grantType: "authorization_code",
            clientId: AUTH.id,
            clientSecret: AUTH.secret,
            code: code,
            state: state
        }

        let oauthGet = await CLIENT.post("auth/v1/token", options);
        if (oauthGet.code != 200) return resolve(null);

        oauthGet = oauthGet.content;

        let oauthRes = new chzzkToken(oauthGet.accessToken, oauthGet.refreshToken, oauthGet.expiresIn);

        return resolve(oauthRes);
    });
}

/**
 * @param {string} refreshToken
 * @returns {Promise<chzzkTokenData>}
 */
async function refresh (refreshToken) {
    return new Promise(async (resolve, reject) => {
        let options = {
            grantType: "refresh_token",
            clientId: AUTH.id,
            clientSecret: AUTH.secret,
            refreshToken: refreshToken,
        }

        let oauthGet = await CLIENT.post("auth/v1/token", options);
        if (oauthGet.code != 200) return resolve(null);

        oauthGet = oauthGet.content;

        let oauthRes = new chzzkToken(oauthGet.accessToken, oauthGet.refreshToken, oauthGet.expiresIn);

        return resolve(oauthRes);
    });
}

/**
 * @param {string} accessToken
 * @returns {Promise<chzzkChannel>}
 */
async function resolve (accessToken) {
    return new Promise(async (resolve, reject) => {

        let oauthGet = await USER.get(accessToken, "open/v1/users/me");
        if (oauthGet.code != 200) return resolve(null);

        oauthGet = oauthGet.content;

        let oauthChannel = await channel.get(oauthGet.channelId);

        return resolve(oauthChannel);

    });
}

module.exports = {
    get: get,
    refresh: refresh,
    resolve: resolve
}