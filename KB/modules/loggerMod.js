// type => "BAN", "KICK", "TIMEOUT", "BAN_REMOVE", "TIMEOUT_REMOVE"
// category => mod
const {MessageEmbed} = require("discord.js");
let colors = require("../utils/colors");

module.exports = async function(guild, {type, category, name, mod, offender, reason, duration = 0}, client){

  if (!guild.options.logger.on) return;

  let color;

  if (type === "BAN" || type === "KICK"){
    color = colors.red;
  }
  if (type === "TIMEOUT" || type === "MUTE"){
    color = colors.orange;
  }
  if (type === "BAN_REMOVE" || type === "TIMEOUT_REMOVE" || type === "MUTE_REMOVE"){
    color = colors.green;
  }

  if (category === "mod") {
    let channelId = guild.options.logger.modChannel;
    if (!channelId) return;

    try{
      let channel = await client.channels.fetch(channelId);
      if (!channel) return;
      if (!guild.options.logger.modAllow.includes(type)) return;
      let embed = new MessageEmbed()
        .setTitle(name)
        .setDescription(`Пользователь: <@${offender?.id || offender}>\nПричина: \`${reason}\`\nМодератор: <@${mod?.id || mod}>\n${duration ? `До: <t:${Math.floor((new Date().getTime() + duration)/1000)}:f>` : ""}`)
        .setFooter(`ID: ${offender?.id || offender}`)
        .setTimestamp(new Date())
        .setColor(color)
      await channel.send({embeds: [embed]});
    }catch (e) {console.log(e)}

  }
}