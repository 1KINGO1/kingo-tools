const {prefix} = require("../config.json");
const {checkRoles, checkChannels} = require("../utils/checkAvailability");
const {MessageEmbed, MessageActionRow, MessageButton} = require("discord.js");
const items = require("../modules/economy/items");
module.exports = {
  name: "buy",
  description: "Покупает предмет с магазина.",
  example: `${prefix}buy [item name]`,
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
        .setDescription("👹 Укажите название предмета")
        .setColor("#eb4034");
      message.reply({embeds: [embed]});
      return;
    }
    let item = items.find(item => item.name.toLowerCase().includes(args.join(" ").toLowerCase()));
    if (!item){
      item = guild.options.economy.economyItems.find(item => item.name.toLowerCase().includes(args.join(" ").toLowerCase()));
    }
    if (!item){
      let embed = new MessageEmbed()
        .setDescription("👹 Предмет не найден!")
        .setColor("#eb4034");
      message.reply({embeds: [embed]});
      return
    }
    if (user.silverCoins < item.silverPrice || user.goldCoins < item.goldPrice){
      let embed = new MessageEmbed()
        .setDescription("👹 Недостаточно средств.")
        .setColor("#eb4034");
      message.reply({embeds: [embed]});
      return;
    }
    let addedOne = false;
    for (let i of user.inventory){
      if (i.name === item.name){
        if (i.amount >= 10 && ["farm"].includes(i.type)){
          let embed = new MessageEmbed()
            .setDescription("👹 Запрещено покупать более 10 одинаковых ферм!")
            .setColor("#eb4034");
          return message.reply({embeds: [embed]});
        }
        i.amount += 1;
        addedOne = true;
        break;
      }
    }
    if (!addedOne){
      if (item.type === "discord_item"){
        user.inventory.push({name: item.name, type: item.type, icon: item.icon, boughtSilverPrice: item.silverPrice, boughtGoldPrice: item.goldPrice, text: item.text, amount: 1})
      }
      else {
        user.inventory.push({name: item.name, type: item.type, icon: item.icon, boughtSilverPrice: item.silverPrice, boughtGoldPrice: item.goldPrice, amount: 1})
      }
    }
    user.silverCoins -= item.silverPrice;
    user.goldCoins -= item.goldPrice;
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
      .setDescription(`Спасибо за покупку!`)
      .setColor("#378f00");
    message.reply({embeds: [embed]});
  }
}