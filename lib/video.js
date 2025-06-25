const { reqChzzk, reqNaver } = require("./tool.js");

/**
 * @typedef {Object.<number, chzzkVideo>} chzzkVideos
 */

/**
 * @typedef {Object} chzzkVideo
 * @property {number} no
 * @property {string} id
 * @property {string} title
 * @property {string} category
 * @property {number} duration
 * @property {string} uploadOn
 * @property {string} imageURL
 * @property {string} trailerURL
 */

/**
 * @param {string} channelID
 * @param {?number} size
 * @returns {Promise<chzzkVideos>}
 */
async function getList (channelID, size) {
    return new Promise(async (resolve, reject) => {
        let res = await reqChzzk("service/v1/channels/" + channelID + "/videos?sortType=LATEST&pagingType=PAGE&page=0&size=" + size || 24);
        if (res.code != 200 || !res.content) return resolve(null);
        let videos = res.content.data;
        if (Object.keys(videos).length < 1) return resolve(null);

        let data = new Map();

        try {
            for (let o in videos) {
                let vdDetail = {
                    no: videos[o].videoNo,
                    id: videos[o].videoId,
                    title: videos[o].videoTitle,
                    category: videos[o].videoCategoryValue,
                    duration: videos[o].duration,
                    uploadOn: videos[o].publishDate,
                    imageURL: videos[o].thumbnailImageUrl,
                    trailerURL: videos[o].trailerUrl
                }

                data[Object.keys(data).length] = vdDetail;
            }
    
            return resolve(data);
        }

        catch(error) {
            return resolve(null);
        }

    });
}

/**
 * @typedef {Object} chzzkVideoDetail
 * @property {string} id
 * @property {string} title
 * @property {string} category
 * @property {number} duration
 * @property {string} uploadOn
 * @property {string} startOn
 * @property {string} imageURL
 * @property {string} trailerURL
 * @property {chzzkVideoURL} videoURL
 */

/**
 * @typedef {Object.<number, string>} chzzkVideoURL
 */

/**
 * @param {number} no
 * @returns {Promise<chzzkVideoDetail>}
 */
async function get (no) {
    return new Promise(async (resolve, reject) => {

        let res = await reqChzzk("service/v3/videos/" + no);
        if (res.code != 200 || !res.content) return resolve(null);
        res = res.content;

        try {
            let vdDetail = {
                id: res.videoId,
                title: res.videoTitle,
                category: res.videoCategoryValue,
                duration: res.duration,
                uploadOn: res.publishDate,
                startOn: res.liveOpenDate,
                imageURL: res.thumbnailImageUrl,
                trailerURL: res.trailerUrl,
                videoURL: "https://apis.naver.com/neonplayer/vodplay/v2/playback/" + res.videoId + "?key=" + res.inKey
            }
    
            return resolve(vdDetail);
        }

        catch(error) {
            return resolve(null);
        }

    });
}

module.exports = {
    getList: getList,
    get: get
}