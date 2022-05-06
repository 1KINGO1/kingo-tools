const {prefix} = require("../config.json");
const {checkRoles, checkChannels} = require("../utils/checkAvailability");
const {MessageEmbed} = require("discord.js");
const {Reminds} = require("../main");
let colors = require("../utils/colors");
module.exports = {
  name: "arm",
  description: "Показывает список всех напоминалок",
  example: `${prefix}arm`,
  category: "utils",
  execute: async function(message, command, dbGuild, client){
    let messageArray = message.content.split(' ');
    let args = messageArray.slice(1);
    let guild = message.guild;
    let member = await guild.members.fetch(message.author.id);
    if (!await checkRoles(command, member)){
      let embed = new MessageEmbed().setDescription("Вы не можете использовать эту команду!").setColor(colors.grayRed);
      message.reply({embeds: [embed]}).catch(e => e);
      return;
    }
    if (!await checkChannels(command, message.channel.id)){
      let embed = new MessageEmbed().setDescription("Вы не можете использовать эту команду здесь!").setColor(colors.grayRed);
      message.reply({embeds: [embed]}).catch(e => e);
      return;
    }
    let reminds = await Reminds.find({user_id: message.author.id})
    let embed = new MessageEmbed()
      .setTitle("Список напоминалок " + message.author.tag)
      .setColor(colors.blue);
    reminds.forEach(r => embed.addField(`<t:${Math.floor(r.sendDate / 1000)}:R>`, r.text));
    if (reminds.length === 0){
      embed.setDescription("Нет напоминалок :(");
    }
    await message.channel.send({embeds: [embed]}).catch(e => e);
  }
}