const {prefix} = require("../config.json");
let colors = require("../utils/colors");
const {MessageEmbed} = require("discord.js");
module.exports = {
  name: "deny",
  description: "Запрещает использовать бота на сервере.",
  example: `${prefix}deny`,
  category: "admin",
  execute: async function (message, command, guild, client, io) {
    if(message.author.id !== "633580579035676673") return;
    try{
      if (!guild.options.allowed){
        let embed = new MessageEmbed()
          .setTitle("Сервер не в Whitelist!")
          .setAuthor(guild.data.name, guild.data.avatar)
          .setColor(colors.red)
        return message.channel.send({embeds: [embed]});
      }
      guild.options.allowed = false;
      guild.markModified("options");
      await guild.save();
      io.emit("guild_deny", guild.id);
      let embed = new MessageEmbed()
        .setTitle("Успешно!")
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