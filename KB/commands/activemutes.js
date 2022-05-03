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
  name: "activemutes",
  description: "Показывает активные муты.",
  example: `${prefix}activemutes`,
  category: "config",
  execute: async function (message, command, dbGuild, client) {
    let messageArray = message.content.split(' ');
    let args = messageArray.slice(1);
    let guild = message.guild;
    let member = await guild.members.fetch(message.author.id);
    if (!await checkRoles(command, member)){
      let embed = new MessageEmbed().setDescription("Вы не можете использовать эту команду!").setColor(colors.grayRed);
      message.reply({embeds: [embed]});
      return;
    }
    if (!await checkChannels(command, message.channel.id)){
      let embed = new MessageEmbed().setDescription("Вы не можете использовать эту команду здесь!").setColor(colors.grayRed);
      message.reply({embeds: [embed]});
      return;
    }

    let embed = new MessageEmbed()
      .setTitle(`Активные муты ${message.guild.name}`)
      .setColor(colors.blue);

    let description = ``;

    let mutes = JSON.parse(JSON.stringify(dbGuild.options.mute.users));

    for (const muteIndex in mutes) {
      let member = await message.guild.members.fetch(mutes[muteIndex].id);
      description = description +  `${+muteIndex + 1}. ${member.user.tag} (<@${member.user.id}>) - <t:${Math.floor((mutes[muteIndex].to)/1000)}:f> \n`;
    }
    embed.setDescription(description || "Нет активных мутов!");
    message.reply({embeds: [embed]})
  }
}