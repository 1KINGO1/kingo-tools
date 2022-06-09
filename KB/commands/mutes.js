const {prefix} = require('../config.json');
const {Guild} = require("../main");
const {checkRoles, checkChannels} = require("../utils/checkAvailability");
const getUserFromMention = require("../utils/getUserFromMention");
const dateParser = require("../utils/dateParser");
const logger = require("../modules/loggerMod");
const moment = require("moment");
const {SlashCommandBuilder} = require("@discordjs/builders");
const {MessageEmbed} = require("discord.js");
const calcLevelByXp = require("../utils/calcLevelByXp");
const characters = require("../modules/economy/characters");
const colors = require("../utils/colors");
moment.locale("de");

module.exports = {
  name: "mutes",
  description: "Список активных мутов.",
  example: `${prefix}mutes`,
  category: "mod",
  execute: async function (message, command, dbGuild, client) {
    let messageArray = message.content.split(' ').filter(a => a.trim());
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

    let mutes = JSON.parse(JSON.stringify(dbGuild.options.mute.users));
    let embed = new MessageEmbed()
      .setTimestamp(new Date())
      .setTitle(`Активные муты ${message.guild.name}`)
      .setColor(colors.gray);
    let description = [];
    for (let muteId in mutes){
      description.push(`${+muteId + 1}. <@${mutes[muteId].id}> До: <t:${Math.floor((mutes[muteId].to)/1000)}:f>`)
    };
    embed.setDescription(description.join("\n"));
    if (description.length === 0){
      embed.setDescription("Нет активных мутов");
    }
    message.reply({embeds: [embed]}).catch(e => e)
  }
}