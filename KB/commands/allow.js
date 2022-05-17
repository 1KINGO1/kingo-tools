const {prefix} = require("../config.json");
let colors = require("../utils/colors");
const {MessageEmbed} = require("discord.js");
module.exports = {
  name: "allow",
  description: "Разрешает использовать бота на сервере.",
  example: `${prefix}allow`,
  category: "admin",
  execute: async function (message, command, guild, client, io) {
    if(message.author.id !== "633580579035676673") return;
    try{
      if (guild.options.allowed){
        let embed = new MessageEmbed()
          .setTitle("Сервер уже в Whitelist!")
          .setAuthor(guild.data.name, guild.data.avatar)
          .setColor(colors.red)
        return message.channel.send({embeds: [embed]});
      }
      guild.options.allowed = true;
      guild.markModified("options");
      await guild.save();
      io.emit("guild_allow", guild.id);
      let embed = new MessageEmbed()
        .setTitle("Доступ надан!")
        .setAuthor(guild.data.name, guild.data.avatar)
        .setColor(colors.green)
      return message.channel.send({embeds: [embed]});
    }catch (e) {
      let embed = new MessageEmbed()
        .setTitle("Ошибка!")
        .setAuthor(guild.data.name, guild.data.avatar)
        .setColor(colors.red)
      message.channel.send({embeds: [embed]})
    }
  }
}