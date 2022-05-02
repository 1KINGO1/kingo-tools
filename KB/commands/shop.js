const {prefix} = require("../config.json");
const items = require("../modules/economy/items");
const {checkRoles, checkChannels} = require("../utils/checkAvailability");
const {MessageEmbed} = require("discord.js");
const colors = require("../utils/colors");
module.exports = {
  name: "shop",
  description: "Показывает список всех предметов.",
  example: `${prefix}shop [discord | game]`,
  category: "economy",
  execute: async function (message, command, guild) {
    if (!guild.options.economy.on) return;
    let messageArray = message.content.split(' ');
    let args = messageArray.slice(1);
    let member = await message.guild.members.fetch(message.author.id);
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
    let user = JSON.parse(JSON.stringify(guild.options.economy.users.find(user => user.id === message.author.id) || ""));
    if (!user) {
      let embed = new MessageEmbed()
        .setDescription("👹 Вы не являетесь участником экономики.")
        .setColor("#eb4034");
      message.reply({embeds: [embed]});
      return;
    }

    if (!args[0]){
      let embed = new MessageEmbed()
        .setDescription("👹 Укажите тип магазина (game или discord).")
        .setColor("#eb4034");
      message.reply({embeds: [embed]});
      return;
    }

    if (args[0] === "game"){
      let embed = new MessageEmbed()
        .setTitle("Список всех " + args[0] + " предметов")
        .setColor("#378f00");
      items.forEach(item => embed.addField(`${item.name} ${item.icon}`, `${item.description}\nСтоимость: **${item.goldPrice ? item.goldPrice + "<:gold_coin:965238193945444372>" : item.silverPrice ? item.silverPrice + "<:silver_coin:965239170459136041>" : "Бесплатно"}**`))
      await message.reply({embeds: [embed]})
    }
    if (args[0] === "discord"){
      let embed = new MessageEmbed()
        .setTitle("Список всех " + args[0] + " предметов")
        .setColor("#378f00");
      if (guild.options.economy.economyItems.length === 0){
        embed.setDescription("Магазин пуст.")
      }
      else{
        guild.options.economy.economyItems.forEach(item => embed.addField(`${item.name} ${item.icon}`, `${item.description}\nСтоимость: **${item.goldPrice ? item.goldPrice + "<:gold_coin:965238193945444372>" : "" + " " + item.silverPrice ? item.silverPrice + "<:silver_coin:965239170459136041>" : ""}**`))
      }
      await message.reply({embeds: [embed]})
    }
  }
}