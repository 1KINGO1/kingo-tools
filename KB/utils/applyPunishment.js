const logger = require("../modules/loggerMod");

module.exports = function applyPunishment(message, {name, reason,duration}, dbGuild, client){
    try{
        switch (name){
            case "timeout":
                message.delete().then(() => {
                    message.member.timeout(duration * 1000 * 60, reason).catch(console.log);
                })
                logger(dbGuild, {
                    type: "TIMEOUT",
                    category: "mod",
                    offender: message.author,
                    name: "timeout",
                    reason,
                    duration: duration * 1000 * 60,
                    mod: client.user
                }, client)
                break;
            case "ban":
                message.delete().then(() => {
                    message.guild.members.ban(message.author.id, {reason}).catch(console.log);
                })
                logger(dbGuild, {type: "BAN", category: "mod", offender: message.author, name: "ban", reason, mod: client.user}, client)
                break;
        }
    }catch (e) {}
}