const { reqChzzk, exChzzk } = require("./tool.js");

class chzzkChannel {
    constructor(channelID, name, description, follower, imageURL, isLive) {
        this.channelID = channelID;
        this.name = name;
        this.description = description;
        this.follower = follower;
        this.imageURL = imageURL;
        this.isLive = isLive;
    }
}

/**
 * @typedef {Object.<number, chzzkChannel>} chzzkChannels
 */

/**
 * @typedef {Object} chzzkChannel
 * @property {string} channelID
 * @property {string} name
 * @property {string} description
 * @property {string} follower
 * @property {string} imageURL
 * @property {string} isLive
 */

/**
 * @param {string} keyword
 * @returns {Promise<chzzkChannels>}
 */
async function getChannel (keyword) {
    return new Promise(async (resolve, reject) => {

        let chSearch = await reqChzzk("service/v1/search/channels?keyword=" + keyword + "&offset=0&size=13&withFirstChannelContent=false");
        if (chSearch.code != 200) return resolve(null);
        chSearch = chSearch.content.data;

        if (!chSearch) return resolve(null);

        let chRes = new Map();

        for (let o in chSearch) {
            let tempChannel = chSearch[o].channel;
            chRes[Object.keys(chRes).length] = new chzzkChannel(tempChannel.channelId, tempChannel.channelName, tempChannel.channelDescription, tempChannel.followerCount, tempChannel.channelImageUrl, tempChannel.openLive);
        }

        return resolve(chRes);

    });
}

/**
 * @param {string} channelID
 * @returns {Promise<boolean>}
 */
async function followChannel (channelID) {
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
async function unFollowChannel (channelID) {
    return new Promise(async (resolve, reject) => {

        let flRes = await exChzzk("DELETE", "service/v1/channels/" + channelID + "/follow");
        if (flRes.code == 200) return resolve(true);
        else return resolve(null);

    });
}

module.exports = {
    getChannel: getChannel,
    followChannel: followChannel,
    unFollowChannel: unFollowChannel
}