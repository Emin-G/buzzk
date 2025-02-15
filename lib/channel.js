const { CLIENT, reqChzzk, exChzzk } = require("./tool.js");

class chzzkChannel {
    constructor(channelID, name, follower, imageURL) {
        this.channelID = channelID;
        this.name = name;
        this.follower = follower;
        this.imageURL = imageURL;
    }
}

/**
 * @typedef {Object.<number, chzzkChannel>} chzzkChannels
 */

/**
 * @typedef {Object} chzzkChannel
 * @property {string} channelID
 * @property {string} name
 * @property {string} follower
 * @property {string} imageURL
 */

/**
 * @param {string} keyword
 * @returns {Promise<chzzkChannels>}
 */
async function search (keyword) {
    return new Promise(async (resolve, reject) => {

        let chSearch = await reqChzzk("service/v1/search/channels?keyword=" + keyword + "&offset=0&size=13&withFirstChannelContent=false");
        if (chSearch.code != 200) return resolve(null);
        chSearch = chSearch.content.data;

        if (!chSearch) return resolve(null);

        let chRes = new Map();

        for (let o in chSearch) {
            let tempChannel = chSearch[o].channel;
            chRes[Object.keys(chRes).length] = new chzzkChannel(tempChannel.channelId, tempChannel.channelName, tempChannel.followerCount, tempChannel.channelImageUrl);
        }

        return resolve(chRes);

    });
}


/**
 * @param {string} channelID
 * @returns {Promise<chzzkChannel>}
 */
async function get (channelID) {
    return new Promise(async (resolve, reject) => {

        let chGet = await CLIENT.get("open/v1/channels?channelIds=" + channelID);
        if (chGet.code != 200) return resolve(null);

        chGet = chGet.content.data[0];

        let chRes = new chzzkChannel(chGet.channelId, chGet.channelName, chGet.followerCount, chGet.channelImageUrl);

        return resolve(chRes);

    });
}

/**
 * @param {string} channelID
 * @returns {Promise<boolean>}
 */
async function follow (channelID) {
    return new Promise(async (resolve, reject) => {

        let flRes = await exChzzk("POST", "service/v1/channels/" + channelID + "/follow");
        if (flRes.code == 200) return resolve(true);
        else return resolve(null);

    });
}

/**
 * @param {string} channelID
 * @returns {Promise<boolean>}
 */
async function unFollow (channelID) {
    return new Promise(async (resolve, reject) => {

        let flRes = await exChzzk("DELETE", "service/v1/channels/" + channelID + "/follow");
        if (flRes.code == 200) return resolve(true);
        else return resolve(null);

    });
}

module.exports = {
    search: search,
    get: get,
    follow: follow,
    unFollow: unFollow
}