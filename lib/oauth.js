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

async function get (code) {
    return new Promise(async (resolve, reject) => {
        let options = {
            grantType: "authorization_code",
            clientId: AUTH.id,
            clientSecret: AUTH.secret,
            code: code,
            state: state
        }

        options = JSON.stringify(options);

        let oauthGet = await CLIENT.post("auth/v1/token", options);
        if (oauthGet.code != 200) return resolve(null);

        oauthGet = oauthGet.content;

        let oauthRes = new chzzkToken(oauthGet.accessToken, oauthGet.refreshToken, oauthGet.expiresIn);

        return resolve(oauthRes);
    });
}

async function refresh (refreshToken) {
    return new Promise(async (resolve, reject) => {
        let options = {
            grantType: "refresh_token",
            clientId: AUTH.id,
            clientSecret: AUTH.secret,
            refreshToken: refreshToken,
        }

        options = JSON.stringify(options);

        let oauthGet = await CLIENT.post("auth/v1/token", options);
        if (oauthGet.code != 200) return resolve(null);

        oauthGet = oauthGet.content;

        let oauthRes = new chzzkToken(oauthGet.accessToken, oauthGet.refreshToken, oauthGet.expiresIn);

        return resolve(oauthRes);
    });
}

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