module.exports = function applyPunishment(message, {name, reason,duration}){
    try{
        switch (name){
            case "timeout":
                message.delete().then(() => {
                    message.member.timeout(duration * 1000 * 60, reason).catch(console.log);
                })
                break;
            case "ban":
                message.delete().then(() => {
                    message.guild.members.ban(message.author.id, {reason}).catch(console.log);
                })
                break;
        }
    }catch (e) {}
}