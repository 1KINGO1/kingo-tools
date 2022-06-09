const {prefix} = require("../config.json");
const {checkRoles, checkChannels} = require("../utils/checkAvailability");
const dateParser = require("../utils/dateParser");
const {Reminds, Guild} = require("../main");
const {MessageEmbed} = require("discord.js");
let colors = require("../utils/colors");
const getUserFromMention = require("../utils/getUserFromMention");
module.exports = {
  name: "temproles",
  description: "Список всех временных ролей.",
  example: `${prefix}temproles`,
  alternative: ["tr"],
  category: "roles",
  execute: async function (message, command, dbGuild, client) {
    let messageArray = message.content.split(' ').filter(a => a.trim());
    let args = messageArray.slice(1);
    let guild = message.guild;
    let member = await guild.members.fetch(message.author.id);
    if (!await checkRoles(command, member)) {
      let embed = new MessageEmbed().setDescription("Вы не можете использовать эту команду!").setColor(colors.grayRed);
      message.reply({embeds: [embed]});
      return;
    }
    if (!await checkChannels(command, message.channel.id)) {
      let embed = new MessageEmbed().setDescription("Вы не можете использовать эту команду здесь!").setColor(colors.grayRed);
      message.reply({embeds: [embed]});
      return;
    }

    let roles = JSON.parse(JSON.stringify(dbGuild.options.timeRoles));
    let description = [];
    let embed = new MessageEmbed()
      .setColor(colors.blue)
      .setTitle(`Временные роли ${message.guild.name}`)
      .setTimestamp(new Date());
    for (let roleId in roles){
      description.push(`${+roleId + 1}. <@${roles[roleId].id}> - <@&${roles[roleId].roleId}>.`)
    }
    embed.setDescription(description.join("\n"));
    if (description.length === 0){
      embed.setDescription(`Нет временных ролей :(`)
    }
    message.reply({embeds: [embed]});
  }
}