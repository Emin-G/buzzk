const { reqChzzk } = require("./tool.js");

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
 * @property {string} liveID
 * @property {string} videoID
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

        let res = await reqChzzk("service/v3/channels/" + channelID + "/live-detail");
        if (res.code != 200 || !res.content) return resolve(null);
        res = res.content;

        try {
            let livePlayback = await JSON.parse(res.livePlaybackJson);
            
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
                polling: JSON.parse(res.livePollingStatusJson),
                liveID: livePlayback.meta.liveId,
                videoID: livePlayback.meta.videoId
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

        let res = await reqChzzk("polling/v3/channels/" + channelID + "/live-status?includePlayerRecommendContent=false");
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

module.exports = {
    getDetail: getDetail,
    getStatus: getStatus
}