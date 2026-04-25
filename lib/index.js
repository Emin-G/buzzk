require("./vm.js");

module.exports = {
    channel: require("./channel.js"),
    chat: require("./chat.js").chzzkChat,
    live: require("./live.js"),
    oauth: require("./oauth.js"),
    
    auth: require("./val.js").auth,
    login: require("./val.js").login
}