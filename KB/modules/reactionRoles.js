module.exports = async function(guild, reaction, user, client, type){
  let {emoji, message} = reaction;
  let rr = guild.options.reactionRole.find(r => r.messageId === message.id && r.channelId === message.channel.id && r.emoji === emoji.name);
  if (!rr) return;

  let role;
  try {
    role = message.guild.roles.cache.find(r => r.id === rr.roleId);
  }catch (e) {return}
  let member;
  try{
    member = await message.guild.members.fetch(user.id)
  }catch (e) {return}
  if (type === "add"){
    try{
      member.roles.add(role);
    }catch (e) {
      return
    }
  }
  if (type === "remove"){
    try{
      member.roles.remove(role);
    }catch (e) {
      return
    }
  }
}