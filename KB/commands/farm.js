const {prefix} = require("../config.json");
const {checkRoles, checkChannels} = require("../utils/checkAvailability");
const {MessageEmbed, MessageActionRow, MessageButton} = require("discord.js");
const items = require("../modules/economy/items");
const colors = require("../utils/colors");
module.exports = {
  name: "farm",
  description: "Собирает ресурсы с всех ферм.",
  example: `${prefix}farm`,
  category: "economy",
  execute: async function (message, command, guild) {
    if (!guild.options.economy.on) return;
    let messageArray = message.content.split(' ');
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
    let user = JSON.parse(JSON.stringify(guild.options.economy.users.find(user => user.id === message.author.id) || ""));
    if (!user) {
      let embed = new MessageEmbed()
        .setDescription("👹 Вы не являетесь участником экономики.")
        .setColor("#eb4034");
      message.reply({embeds: [embed]}).catch(e => e);
      return;
    }
    let farms = user.inventory.filter(item => ["farm"].includes(item.type));
    farms = farms.map(farm => items.find(item => item.name === farm.name) ? {...items.find(item => item.name === farm.name), amount: farm.amount} : false).filter(farm => farm);

    if (farms.length === 0) {
      let embed = new MessageEmbed()
        .setDescription("👹 У вас нет доступных ферм!")
        .setColor("#eb4034");
      return message.reply({embeds: [embed]}).catch(e => e);
    }

    let countdown = user.farmLastCollect;

    if (countdown > new Date().getTime()){
      let embed = new MessageEmbed()
        .setDescription(`👹 Вы сможете получить прибыль с ферм <t:${Math.floor(user.farmLastCollect/1000)}:R>!`)
        .setColor("#eb4034");
      return message.reply({embeds: [embed]});
    }

    let coins = farms.reduce((prev, current) => {
      return {gold: prev.gold + current.farmGoldEarn * current.amount, silver: prev.silver + current.farmSilverEarn  * current.amount}
    }, {gold: 0, silver: 0})

    user.silverCoins += coins.silver;
    user.goldCoins += coins.gold;
    user.farmLastCollect  = new Date().getTime() + 1000 * 60 * 60 * 24;
    let resultArray = [];
    for (let usr of JSON.parse(JSON.stringify(guild.options.economy.users || []))) {
      if (usr.id === user.id) {
        resultArray.push(user);
      } else {
        resultArray.push(usr);
      }
    }
    guild.options = {...guild.options, economy: {...guild.options.economy, users: resultArray}};
    guild.markModified("options");
    await guild.save();
    let embed = new MessageEmbed()
      .setDescription(`Собрано ${coins.gold}<:gold_coin:965238193945444372> ${coins.silver}<:silver_coin:965239170459136041>`)
      .setColor("#378f00");
    message.reply({embeds: [embed]});
  }
}