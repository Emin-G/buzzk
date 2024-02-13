const { getStatus } = require("./live.js");
const { reqGame } = require("./tool.js");

const { WebSocket } = require("ws");

class chzzkChat {
    constructor(channelID) {
        this.channelID = channelID;
    }

    //Private
    #ws; //Chat Web Socket
    #ssID; //kr-ss?.chat.naver.com/chat
    #accTkn; //Account Access Token
    #svcid; //game
    #uid;
    #sid;
    #chatID;

    #pollingStatus = false;
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

            //Get ChatID
            let cidRes = await getStatus(this.channelID);
            this.#chatID = cidRes.chatID;
            //Get ChatID

            //Get accTkn
            let accRes = await reqGame("nng_main/v1/chats/access-token?channelId=" + this.#chatID + "&chatType=STREAMING");
            if (accRes.code != 200) return resolve(null);
            this.#accTkn = accRes.content.accessToken;
            //Get accTkn
    
            //Load Balancing
            this.#ssID = Math.floor(Math.random() * 10) + 1;
            //Load Balancing
    
            //Connect Web Socket
            this.#ws = new WebSocket("wss://kr-ss" + this.#ssID + ".chat.naver.com/chat");
            //Connect Web Socket

            //SetPolling
            if (!this.#pollingStatus) this.#polling();
            //SetPolling

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
            this.#ws.on("message", (data) => {    
                data = JSON.parse(data);
    
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
                else if (data.cmd == 10100) resolve(true);
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
                "emojis":""
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
     */

    /**
     * @param {function(chzzkMessages)} callback
     */
    onMessage(callback) {
        if (!this.#ws) return callback(null);

        this.#ws.on("message", (data) => {
            data = JSON.parse(data);

            if (data.cmd == 93101) {
                
                data = data.bdy;
                let msgList = new Map();

                for (let o in data) {
                    data[o].profile = JSON.parse(data[o].profile);

                    msgList[Object.keys(msgList).length] = {
                        author: {
                            id: data[o].uid,
                            name: data[o].profile.nickname,
                            imageURL: data[o].profile.profileImageUrl
                        },
                        message: data[o].msg,
                        time: data[o].msgTime
                    };
                }

                callback(msgList);

            }
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

            this.#ws.on("message", (data) => {
                data = JSON.parse(data);

                if (data.cmd == 15101) {
                    data = data.bdy.messageList;
                    let msgList = new Map();
    
                    for (let o in data) {
                        data[o].profile = JSON.parse(data[o].profile);

                        if (!data[o].profile) {
                            data[o].profile = {
                                nickname: null,
                                profileImageUrl: null
                            }
                        }
    
                        msgList[Object.keys(msgList).length] = {
                            author: {
                                id: data[o].userId,
                                name: data[o].profile.nickname,
                                imageURL: data[o].profile.profileImageUrl
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
        if (!this.#ws) return this.#pollingStatus = false;
        this.#pollingStatus = true;

        //Get ChatID
        let cidRes = await getStatus(this.channelID);
        this.#chatID = cidRes.chatID;
        //Get ChatID

        setTimeout(() => {
            return this.#polling();
        }, cidRes.polling.callPeriodMilliSecond);
    }
}

module.exports = {
    chzzkChat: chzzkChat
}