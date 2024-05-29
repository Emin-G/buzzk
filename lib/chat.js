const { getStatus } = require("./live.js");
const { reqChzzk, reqGame } = require("./tool.js");

const { WebSocket } = require("ws");

class chzzkChat {
    constructor(channelID) {
        this.channelID = channelID;
    }

    //Private
    #ws; //Chat Web Socket
    #ssID; //kr-ss?.chat.naver.com/chat
    #accTkn; //Account Access Token
    #extTkn //for RealName Auth
    #svcid; //game
    #uid;
    #sid;
    #chatID;
    #callbacks = new Map();

    #pollingStatus = false;
    #pingStatus = false;
    //Private

    /**
     * @returns {Promise<boolean>}
     */
    connect() {
        return new Promise(async (resolve, reject) => {
            if (this.#ws) return resolve(null);

            //Get UID
            let myInfo = await reqGame("nng_main/v1/user/getUserStatus");
            if (myInfo.code != 200) return resolve(null);
            this.#uid = myInfo.content.userIdHash;

            //SetPolling
            if (!this.#pollingStatus) this.#polling();
            //SetPolling

            //Get ChatID
            let cidRes = await getStatus(this.channelID);
            if (!cidRes) return resolve(null);
            this.#chatID = cidRes.chatID;
            //Get ChatID

            //Get accTkn
            let accRes = await reqGame("nng_main/v1/chats/access-token?channelId=" + this.#chatID + "&chatType=STREAMING");
            if (accRes.code != 200) return resolve(null);
            this.#accTkn = accRes.content.accessToken;
            this.#extTkn = accRes.content.extraToken;
            //Get accTkn
    
            //Load Balancing
            this.#ssID = Math.floor(Math.random() * 10) + 1;
            //Load Balancing
    
            //Connect Web Socket
            this.#ws = new WebSocket("wss://kr-ss" + this.#ssID + ".chat.naver.com/chat");
            //Connect Web Socket

            //WS Open
            this.#ws.on("open", () => {
                console.log("[WS] Connected!");

                //WS First Connect
                let connectOpt = {
                    "ver": "2",
                    "cmd": 100,
                    "svcid": "game",
                    "cid": this.#chatID,
                    "bdy": {
                        "uid": this.#uid,
                        "devType":2001,
                        "accTkn": this.#accTkn,
                        "auth":"SEND"
                    },
                    "tid": 1
                };
    
                this.#ws.send(JSON.stringify(connectOpt));
                //WS First Connect
            });
            //WS Open

            this.#ws.on("error", console.error);

            this.#ws.on("close", () => {
                console.log("[WS] Disconnect!");
            });

            //WS Message
            this.#ws.on("message", async (data) => {    
                try {
                    data = await JSON.parse(data);
                }

                catch (error) {
                    return;
                }
    
                //Update Var
                if (data.cid) this.#chatID = data.cid;
                if (data.svcid) this.#svcid = data.svcid;
                if (data.bdy && data.bdy.sid) this.#sid = data.bdy.sid;
                //Update Var
    
                //Ping Pong
                if (data.cmd == 0) {
                    let pongOpt = {
                        "ver": "2",
                        "cmd": 10000
                    };
                    this.#ws.send(JSON.stringify(pongOpt));
                }
                //Ping Pong
    
                //Connected
                else if (data.cmd == 10100) {
                    if (!this.#pingStatus) this.#ping();
                    resolve(true);
                }
                //Connected
            });
            //WS Message

        });
    }

    /**
     * @param {string} message 
     * @returns {Promise<boolean>}
     */
    send(message) {
        return new Promise(async (resolve, reject) => {
            if (!this.#ws) return resolve(null);

            let extras = {
                "chatType":"STREAMING",
                "osType":"PC",
                "streamingChannelId": this.channelID,
                "emojis":"",
                "extraToken": this.#extTkn
            }

            //WS Send
            let date = new Date();
            let sendOpt = {
                "ver": "2",
                "cmd": 3101,
                "svcid": this.#svcid,
                "cid": this.#chatID,
                "sid": this.#sid,
                "retry": false,
                "bdy": {
                    "msg": message,
                    "msgTypeCode": 1,
                    "extras": JSON.stringify(extras),

                    "msgTime": date.getTime()
                },
                "tid": 3
            };

            this.#ws.send(JSON.stringify(sendOpt));

            return resolve(true);
            //WS Send

        });
    }

    /**
     * @typedef {Object.<number, chzzkMessage>} chzzkMessages
     */

    /**
     * @typedef {Object} chzzkMessage
     * @property {chzzkMessageAuthor} author
     * @property {string} message
     * @property {number} time
     */

    /**
     * @typedef {Object} chzzkMessageAuthor
     * @property {string} id
     * @property {string} name
     * @property {string} imageURL
     * @property {boolean} hasMod
     */

    /**
     * @param {function(chzzkMessages)} callback
     */
    onMessage(callback) {
        this.#callbacks[Object.keys(this.#callbacks).length] = {
            type: "message",
            callback: callback
        };
        this.#onMessageHandler(callback);
    }

    #onMessageHandler (callback) {
        if (!this.#ws) return callback(null);

        this.#ws.on("message", async (data) => {
            try {
                data = await JSON.parse(data);
            }

            catch (error) {
                return;
            }

            if (data.cmd == 93101) {
                
                data = data.bdy;
                let msgList = new Map();

                for (let o in data) {
                    if (data[o].profile) {
                        try {
                            data[o].profile = await JSON.parse(data[o].profile);
                        }

                        catch (error) {
                            return;
                        }
                    }
                    else {
                        data[o].profile = {
                            nickname: null,
                            profileImageUrl: null,
                            userRoleCode: null
                        };
                    }

                    try {
                        let modVal = false;
                        if (data[o].profile.userRoleCode === "streamer" || data[o].profile.userRoleCode === "streaming_channel_manager" || data[o].profile.userRoleCode === "streaming_chat_manager") modVal = true;

                        msgList[Object.keys(msgList).length] = {
                            author: {
                                id: data[o].uid,
                                name: data[o].profile.nickname,
                                imageURL: data[o].profile.profileImageUrl,
                                hasMod: modVal
                            },
                            message: data[o].msg,
                            time: data[o].msgTime
                        };
                    }

                    catch(error) {
                        return;
                    }
                }

                callback(msgList);

            }
        });
    }

    onDonation(callback) {
        this.#callbacks[Object.keys(this.#callbacks).length] = {
            type: "donation",
            callback: callback
        };
        this.#onDonationHandler(callback);
    }

    #onDonationHandler (callback) {
        if (!this.#ws) return callback(null);

        this.#ws.on("message", async (data) => {
            try {
                data = await JSON.parse(data);
            }

            catch (error) {
                return;
            }

            if (data.cmd == 93102) {
                
                data = data.bdy;
                let msgList = new Map();

                for (let o in data) {
                    if (data[o].profile) {
                        try {
                            data[o].profile = await JSON.parse(data[o].profile);
                            data[o].extras = await JSON.parse(data[o].extras);
                        }

                        catch (error) {
                            return;
                        }
                    }
                    else {
                        data[o].profile = {
                            nickname: null,
                            profileImageUrl: null,
                            userRoleCode: null
                        };
                    }

                    try {
                        let modVal = false;
                        if (data[o].profile.userRoleCode === "streamer" || data[o].profile.userRoleCode === "streaming_channel_manager" || data[o].profile.userRoleCode === "streaming_chat_manager") modVal = true;

                        msgList[Object.keys(msgList).length] = {
                            amount: data[o].extras.payAmount,
                            author: {
                                id: data[o].uid,
                                name: data[o].profile.nickname,
                                imageURL: data[o].profile.profileImageUrl,
                                hasMod: modVal
                            },
                            message: data[o].msg,
                            time: data[o].msgTime
                        };
                    }

                    catch(error) {
                        return;
                    }
                }

                callback(msgList);

            }
        });
    }

    /**
     * @param {function} callback
     */
    onDisconnect(callback) {
        if (!this.#ws) return callback(null);

        this.#ws.on("close", () => {
            callback();
        });
    }

    /**
     * @param {?number} size
     * @return {Promise<chzzkMessages>}
     */
    getRecentChat(size) {
        return new Promise(async (resolve, reject) => {
            if (!this.#ws) return resolve(null);

            let reqOpt = {
                "ver": "2",
                "cmd": 5101,
                "svcid": this.#svcid,
                "cid": this.#chatID,
                "sid": this.#sid,
                "bdy": {
                    "recentMessageCount": size || 50
                },
                "tid": 2
            };

            this.#ws.send(JSON.stringify(reqOpt));

            this.#ws.on("message", async (data) => {
                try {
                    data = await JSON.parse(data);
                }

                catch (error) {
                    return;
                }

                if (data.cmd == 15101) {
                    data = data.bdy.messageList;
                    let msgList = new Map();
    
                    for (let o in data) {
                        try {
                            data[o].profile = await JSON.parse(data[o].profile);
                        }

                        catch (error) {
                            return;
                        }

                        if (!data[o].profile) {
                            data[o].profile = {
                                nickname: null,
                                profileImageUrl: null,
                                userRoleCode: null
                            }
                        }

                        let modVal = false;
                        if (data[o].profile.userRoleCode === "streamer" || data[o].profile.userRoleCode === "streaming_channel_manager" || data[o].profile.userRoleCode === "streaming_chat_manager") modVal = true;
    
                        msgList[Object.keys(msgList).length] = {
                            author: {
                                id: data[o].userId,
                                name: data[o].profile.nickname,
                                imageURL: data[o].profile.profileImageUrl,
                                hasMod: modVal
                            },
                            message: data[o].content,
                            time: data[o].messageTime
                        };
                    }
    
                    return resolve(msgList);
                }

            });

        });
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
            let profileCard = await reqGame("nng_main/v1/chats/" + this.#chatID + "/users/" + authorID + "/profile-card?chatType=STREAMING");
            if (profileCard.code != 200) return resolve(null);
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
            if (!this.#ws) return resolve(null);

            await this.#ws.close();
            this.#ws = null;
            return resolve(true);
        });
    }

    async #polling () {
        //if (!this.#ws) return this.#pollingStatus = false;
        this.#pollingStatus = true;

        //Get ChatID
        let cidRes = await getStatus(this.channelID);
        if (cidRes && cidRes.chatID && cidRes.chatID != this.#chatID) {
            this.#chatID = cidRes.chatID;

            //Reconnect
            this.#pollingStatus = false;
            await this.disconnect();
            let connectRes = await this.connect();
            if (connectRes) {
                for (let o in this.#callbacks) {
                    if (this.#callbacks[o].type === "message") this.#onMessageHandler(this.#callbacks[o].callback);
                    else if (this.#callbacks[o].type === "donation") this.#onDonationHandler(this.#callbacks[o].callback);
                }
                return;
            }
            //Reconnect
        }
        //Get ChatID

        let interval;
        if (cidRes && cidRes.polling && cidRes.polling.callPeriodMilliSecond) interval = cidRes.polling.callPeriodMilliSecond;
        else interval = 30000;

        setTimeout(() => {
            return this.#polling();
        }, interval);
    }

    async #ping () {
        if (!this.#ws) return this.#pingStatus = false;
        this.#pingStatus = true;

        let pingOpt = {
            "ver": "2",
            "cmd": 0
        };
        if (this.#ws.readyState == WebSocket.OPEN) this.#ws.send(JSON.stringify(pingOpt));

        setTimeout(() => {
            return this.#ping();
        }, 20000);
    }
}

module.exports = {
    chzzkChat: chzzkChat
}