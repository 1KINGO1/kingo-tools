const {prefix} = require("../config.json");
const {checkRoles, checkChannels} = require("../utils/checkAvailability");
const axios = require("axios");
const items = require("../modules/economy/items");
let iconv = require('iconv-lite');
const {MessageEmbed} = require("discord.js");
module.exports = {
  name: "removeitem",
  description: "Удаляет кастомный предмет из магазина.",
  example: `${prefix}removeitem [item name]`,
  category: "economy",
  execute: async function (message, command, guild) {
    if (!guild.options.economy.on) return;
    let messageArray = message.content.split(' ');
    let args = messageArray.slice(1);
    let member = await message.guild.members.fetch(message.author.id);
    if (!await checkRoles(command, member)) {
      message.reply("Вы не можете использовать данную команду!");
      return;
    }
    ;
    if (!await checkChannels(command, message.channel.id)) {
      message.reply("Вы не можете использовать эту команду здесь!");
      return;
    }
    if (!args[0]){
      message.reply("Укажите имя предмета!");
      return;
    }

    if (!guild.options.economy.economyItems.find(item => item.name.toLowerCase().includes(args[0].toLowerCase()))){
      return message.reply("Предмет не найден!");
    }
    let resultArray = [];
    for (let item of JSON.parse(JSON.stringify(guild.options.economy.economyItems || []))) {
      if (item.name.toLowerCase().includes(args[0].toLowerCase())) {
        let embed = new MessageEmbed()
          .setDescription(`Предмет \`${item.name}\` удалён!`)
          .setColor("#378f00");
        message.reply({embeds: [embed]});
        continue;
      }
      resultArray.push(item);
    }
    guild.options = {...guild.options, economy: {...guild.options.economy, economyItems: resultArray}};
    guild.markModified("options");
    await guild.save();
  }
}