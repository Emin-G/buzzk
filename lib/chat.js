const { getStatus } = require("./live.js");
const oauth = require("./oauth.js");
const { USER, reqGame } = require("./tool.js");

const io = require("socket.io-client");

class chzzkChatData {
    constructor(id, name, hasMod, message, emojis, time) {
        this.author = {
            id: id,
            name: name,
            hasMod: hasMod
        };
        this.message = message;
        this.emojis = emojis;
        this.time = time;
    }
}

class chzzkDonationData {
    constructor(type, amount, id, name, message, emojis) {
        this.type = type;
        this.amount = amount;
        this.author = {
            id: id,
            name: name
        };
        this.message = message;
        this.emojis = emojis;
    }
}

class chzzkChat {
    constructor(accessToken) {
        this.accessToken = accessToken;
    }

    //Private
    #ws; //Chat Web Socket
    #channelID;
    #session;
    #callbacks = {
        message: null,
        donation: null,
        disconnect: null
    };

    #status = {
        ws: false,
        established: false
    }
    //Private

    /**
     * @returns {Promise<boolean>}
     */
    connect() {
        return new Promise(async (resolve, reject) => {
            
            if (this.#status.ws) return resolve(false);
            this.#status.ws = true;

            let channel = await oauth.resolve(this.accessToken);
            if (!channel) {
                this.#status.ws = false;
                return resolve(null);
            }
            this.#channelID = channel.channelID;

            let session = await USER.get(this.accessToken, "open/v1/sessions/auth");
            if (!session || session.code != 200) {
                this.#status.ws = false;
                return resolve(null);
            }
            session = session.content.url;
            console.log(session);
 
            const socketOption = {
                reconnection: false,
                "force new connection": true,
                "connect timeout": 6000,
                transports: ["websocket"]
            };
            
            this.#ws = io.connect(session, socketOption);

            this.#ws.on("connect", async (data) => { 
                console.log("[WS] Connected!");
            });

            this.#ws.on("SYSTEM", async (data) => {
                data = JSON.parse(data);
                console.log(data);

                if (data.type == "connected") {
                    this.#session = data.data.sessionKey;
    
                    let subChat = await USER.post(this.accessToken, "open/v1/sessions/events/subscribe/chat?sessionKey=" + this.#session, null);
                    let subDona = await USER.post(this.accessToken, "open/v1/sessions/events/subscribe/donation?sessionKey=" + this.#session, null);
                    if (!subChat || subChat.type == "subscribed" || !subDona || subDona.type == "subscribed") return resolve(null);
                    this.#status.established = true;
                    console.log("[WS] Subscribed!");
                    return resolve(true);
                }
            });

            this.#ws.on("CHAT", (data) => {
                if (!this.#callbacks.message) return;
                data = JSON.parse(data);
                console.log(data);

                let hasMod = false;
                if (data.profile || data.profile.badges) {
                    for (let o in data.profile.badges) {
                        if (data.profile.badges[o].imageUrl == "https://ssl.pstatic.net/static/nng/glive/icon/streamer.png") hasMod = true;
                        if (data.profile.badges[o].imageUrl == "https://ssl.pstatic.net/static/nng/glive/icon/manager.png") hasMod = true;
                    }
                }

                let chatData = new chzzkChatData(data.senderChannelId, data.profile.nickname, hasMod, data.content, data.emojis, data.messageTime);
                return this.#callbacks.message(chatData);
            });

            this.#ws.on("DONATION", (data) => {
                if (!this.#callbacks.donation) return;
                data = JSON.parse(data);
                console.log(data);

                let donationData = new chzzkDonationData(data.donationType, data.payAmount, data.donatorChannelId, data.donatorNickname, data.donationText, data.emojis);
                return this.#callbacks.donation(donationData);
            });

            this.#ws.on("error", (error) => {
                console.log(error);

                if (!this.#status.established) return resolve(null);
            });

            this.#ws.on("disconnect", (data) => {
                console.log("[WS] Disconnected! (" + data + ")");

                this.#status.ws = false;
                this.#status.established = false;
                this.#callbacks.disconnect(data);

                if (this.#ws) this.#ws.off();
                if (!this.#status.established) resolve(null);

                this.#ws = null;
                this.#channelID = null;
                this.#session = null;
                return this.connect();
            });

        });
    }

    /**
     * @param {string} message 
     * @returns {Promise<boolean>}
     */
    send(message) {
        return new Promise(async (resolve, reject) => {
            if (!this.#ws || !this.#status.ws || !this.#status.established) return resolve(false);
            console.log(message);

            let reqMessage = {
                message: message
            }

            let chatRes = await USER.post(this.accessToken, "open/v1/chats/send", JSON.stringify(reqMessage));
            if (!chatRes || chatRes.code != 200) return resolve(false);

            return resolve(true);
        });
    }

    /**
     * @param {string} message 
     * @returns {Promise<boolean>}
     */
    setNotice(message) {
        return new Promise(async (resolve, reject) => {
            if (!this.#ws || !this.#status.ws || !this.#status.established) return resolve(false);

            let reqMessage = {
                message: message
            }

            let noticeRes = await USER.post(this.accessToken, "open/v1/chats/notice", JSON.stringify(reqMessage));
            if (!noticeRes || noticeRes.code != 200) return resolve(false);

            return resolve(true);
        });
    }

    /**
     * @typedef {Object} chzzkMessage
     * @property {chzzkAuthor} author
     * @property {string} message
     * @property {Object} emoji
     * @property {number} time
     */

    /**
     * @typedef {Object} chzzkDonation
     * @property {string} type
     * @property {string} amount
     * @property {chzzkAuthor} author
     * @property {string} message
     * @property {Object} emoji
     * @property {number} time
     */

    /**
     * @typedef {Object} chzzkAuthor
     * @property {string} id
     * @property {string} name
     * @property {boolean} hasMod
     */

    /**
     * @param {function(chzzkMessage)} callback
     */
    onMessage(callback) {
        this.#callbacks.message = callback;
    }

    /**
     * @param {function(chzzkDonation)} callback
     */
    onDonation(callback) {
        this.#callbacks.donation = callback;
    }

    /**
     * @param {function} callback
     */
    onDisconnect(callback) {
        this.#callbacks.disconnect = callback;
    }

    /**
     * @typedef {Object} chzzkUserInfo
     * @property {string} channelID
     * @property {string} name
     * @property {string} imageURL
     * @property {string} role
     * @property {string} followDate
     * @property {number} totalMessage
     */

    /**
     * @param {string} authorID 
     * @returns {Promise<chzzkUserInfo>}
     */
    async getUserInfo (authorID) {
        return new Promise(async (resolve, reject) => {
            let status = await getStatus(this.#channelID);
            if (!status) return resolve(null);

            let profileCard = await reqGame("nng_main/v1/chats/" + status.chatID + "/users/" + authorID + "/profile-card?chatType=STREAMING");
            if (!profileCard || profileCard.code != 200) return resolve(null);
            profileCard = profileCard.content;

            let userInfo = {
                channelID: profileCard.userIdHash,
                name: profileCard.nickname,
                imageURL: profileCard.profileImageUrl,
                role: profileCard.userRoleCode,
                followDate: null
            }

            if (profileCard.streamingProperty.following) userInfo["followDate"] = profileCard.streamingProperty.following.followDate;

            return resolve(userInfo);
        });
    }

    /**
     * @returns {Promise<boolean>}
     */
    async disconnect() {
        return new Promise(async (resolve, reject) => {
            if (!this.#status.ws) return resolve(null);

            await this.#ws.off();
            await this.#ws.close();

            this.#status.ws = false;
            this.#status.established = false;
            console.log("[WS] Disconnected! (Force)");
            return resolve(true);
        });
    }
}

module.exports = {
    chzzkChat: chzzkChat
}