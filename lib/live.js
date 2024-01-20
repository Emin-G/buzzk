const { reqChzzk } = require("./tool.js");

async function getLiveDetail (channelID) {
    return new Promise(async (resolve, reject) => {

        let res = await reqChzzk("service/v2/channels/" + channelID + "/live-detail");
        if (res.code != 200) return resolve(null);
        res = res.content;

        let lvDetail = {
            channelID: res.channel.channelId,
            channel: res.channel,
            chatID: res.chatChannelId,
            chatLimit: res.chatAvailableGroup,
            userCount: { now: res.concurrentUserCount, total: res.accumulateCount },
            title: res.liveTitle,
            startOn: res.openDate,
            closeOn: res.closeDate,
            status: res.status,
            polling: JSON.parse(res.livePollingStatusJson)
        }

        return resolve(lvDetail);

    });
}

async function getLiveStatus (channelID) {
    return new Promise(async (resolve, reject) => {

        let res = await reqChzzk("polling/v2/channels/" + channelID + "/live-status");
        if (res.code != 200) return resolve(null);
        res = res.content;

        let lvStatus = {
            channelID: channelID,
            chatID: res.chatChannelId,
            userCount: { now: res.concurrentUserCount, total: res.accumulateCount },
            title: res.liveTitle,
            status: res.status,
            polling: JSON.parse(res.livePollingStatusJson)
        }
        
        return resolve(lvStatus);

    });
}

module.exports = {
    getLiveDetail: getLiveDetail,
    getLiveStatus: getLiveStatus
}