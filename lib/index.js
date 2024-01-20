require("./vm.js");

module.exports = {
    channel: require("./channel.js"),
    chat: require("./chat.js").chzzkChat,
    live: require("./live.js"),
    
    login: require("./val.js").login
}