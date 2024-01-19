const { reqChzzk } = require("./tool.js");

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

async function getChannel (keyword) {
    return new Promise(async (resolve, reject) => {

        let chSearch = await reqChzzk("service/v1/search/channels?keyword=" + keyword + "&offset=0&size=13&withFirstChannelContent=false");
        chSearch = chSearch.content.data;

        if (!chSearch) return resolve();

        let chRes = new Map();

        for (let o in chSearch) {
            let tempChannel = chSearch[o].channel;
            chRes[Object.keys(chRes).length] = new chzzkChannel(tempChannel.channelId, tempChannel.channelName, tempChannel.channelDescription, tempChannel.followerCount, tempChannel.channelImageUrl, tempChannel.openLive);
        }

        return resolve(chRes);

    });
}

module.exports = {
    getChannel: getChannel
}