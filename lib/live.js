const { reqChzzk, reqGame } = require("./tool.js");

/**
 * @typedef {Object} chzzkLiveDetail
 * @property {string} channelID
 * @property {channelInfo} channel
 * @property {string} chatID
 * @property {string} chatLimit
 * @property {userCount} userCount
 * @property {string} title
 * @property {string} category
 * @property {string} startOn
 * @property {string} closeOn
 * @property {string} status
 * @property {Object} polling
 * 
 */

/**
 * @typedef {Object} channelInfo
 * @property {string} name
 * @property {string} imageURL
 */

/**
 * @typedef {Object} userCount
 * @property {number} now
 * @property {number} total
 */

/**
 * @param {string} channelID
 * @returns {Promise<chzzkLiveDetail>}
 */
async function getDetail (channelID) {
    return new Promise(async (resolve, reject) => {

        let res = await reqChzzk("service/v2/channels/" + channelID + "/live-detail");
        if (res.code != 200 || !res.content) return resolve(null);
        res = res.content;

        try {
            let lvDetail = {
                channelID: res.channel.channelId,
                channel: { name: res.channel.channelName, imageURL: res.channel.channelImageUrl },
                chatID: res.chatChannelId,
                chatLimit: res.chatAvailableGroup,
                userCount: { now: res.concurrentUserCount, total: res.accumulateCount },
                title: res.liveTitle,
                category: res.liveCategoryValue,
                startOn: res.openDate,
                closeOn: res.closeDate,
                status: res.status,
                polling: JSON.parse(res.livePollingStatusJson)
            }
    
            return resolve(lvDetail);
        }

        catch(error) {
            return resolve(null);
        }

    });
}

/**
 * @typedef {Object} chzzkLiveStatus
 * @property {string} channelID
 * @property {string} chatID
 * @property {userCount} userCount
 * @property {string} title
 * @property {string} status
 * @property {Object} polling
 * 
 */

/**
 * @param {string} channelID
 * @returns {Promise<chzzkLiveStatus>}
 */
async function getStatus (channelID) {
    return new Promise(async (resolve, reject) => {

        let res = await reqChzzk("polling/v2/channels/" + channelID + "/live-status");
        if (res.code != 200 || !res.content) return resolve(null);
        res = res.content;

        try {
            let lvStatus = {
                channelID: channelID,
                chatID: res.chatChannelId,
                userCount: { now: res.concurrentUserCount, total: res.accumulateCount },
                title: res.liveTitle,
                status: res.status,
                polling: JSON.parse(res.livePollingStatusJson)
            }

            return resolve(lvStatus);
        }
        
        catch(error) {
            return resolve(null);
        }

    });
}

async function getAccess (chatID) {
    return new Promise(async (resolve, reject) => {
        let accRes = await reqGame("nng_main/v1/chats/access-token?channelId=" + chatID + "&chatType=STREAMING");
        if (accRes.code != 200) return resolve(null);
        return resolve(accRes.content.accessToken);
    });
}

module.exports = {
    getDetail: getDetail,
    getStatus: getStatus,
    getAccess: getAccess
}