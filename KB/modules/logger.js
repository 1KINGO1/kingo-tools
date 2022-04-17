// type => "BAN", "KICK", "TIMEOUT", "BAN_REMOVE", "TIMEOUT_REMOVE"
// category => mod
const {client} = require("../main");
const {MessageEmbed} = require("discord.js");

module.exports = async function(guild, {type, category, name, mod, offender, reason}){

  if (!guild.options.logger.on) return;

  let color;

  if (type === "BAN" || type === "KICK"){
    color = "#eb4034";
  }
  if (type === "TIMEOUT"){
    color = "#ccb800";
  }
  if (type === "BAN_REMOVE" || type === "TIMEOUT_REMOVE"){
    color = "#378f00";
  }

  if (category === "mod") {
    let channelId = guild.options.logger.modChannel;
    if (!channelId) return;

    try{
      let channel = await client.channels.cache.get(channelId);
      if (!channel) return;
      if (!guild.options.logger.modAllow.includes(type)) return;
      let embed = new MessageEmbed()
        .setTitle(name)
        .setDescription(`Пользователь: <@${offender.id}>\nПричина: ${reason}\nМодератор: <@${mod.id}>`)
        .setFooter(`ID: ${offender.id}`)
        .setTimestamp(new Date())
        .setColor(color)
      await channel.send({embeds: [embed]});
    }catch (e) {}

  }
}