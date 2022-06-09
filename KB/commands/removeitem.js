const {prefix} = require("../config.json");
const {checkRoles, checkChannels} = require("../utils/checkAvailability");
const axios = require("axios");
const items = require("../modules/economy/items");
let iconv = require('iconv-lite');
const {MessageEmbed} = require("discord.js");
const colors = require("../utils/colors");
module.exports = {
  name: "allroles",
  description: "Показывает список всех ролей.",
  example: `${prefix}allroles`,
  category: "roles",
  execute: async function (message, command, guild) {
    if (!guild.options.economy.on) return;
    let messageArray = message.content.split(' ').filter(a => a.trim());
    let args = messageArray.slice(1);
    let member = await message.guild.members.fetch(message.author.id);
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
    if (!args[0]){
      let embed = new MessageEmbed().setDescription("Укажите имя предмета!").setColor(colors.grayRed);
      message.reply({embeds: [embed]}).catch(e => e);
      return;
    }

    if (!guild.options.economy.economyItems.find(item => item.name.toLowerCase().includes(args[0].toLowerCase()))){
      let embed = new MessageEmbed().setDescription("Предмет не найден!").setColor(colors.gray);
      message.reply({embeds: [embed]}).catch(e => e);
      return;
    }
    let resultArray = [];
    for (let item of JSON.parse(JSON.stringify(guild.options.economy.economyItems || []))) {
      if (item.name.toLowerCase().includes(args[0].toLowerCase())) {
        let embed = new MessageEmbed()
          .setDescription(`Предмет \`${item.name}\` удалён!`)
          .setColor("#378f00");
        message.reply({embeds: [embed]}).catch(e => e);
        continue;
      }
      resultArray.push(item);
    }
    guild.options = {...guild.options, economy: {...guild.options.economy, economyItems: resultArray}};
    guild.markModified("options");
    await guild.save();
  }
}