const {prefix} = require("../config.json");
const {checkRoles, checkChannels} = require("../utils/checkAvailability");
const {MessageEmbed} = require("discord.js");
const getUserFromMention = require("../utils/getUserFromMention");
const colors = require("../utils/colors");
module.exports = {
  name: "pay",
  description: "Передаёт средства другому пользователю.",
  example: `${prefix}pay [mention or id] [gold or silver] [amount]`,
  category: "economy",
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
    let user = JSON.parse(JSON.stringify(guild.options.economy.users.find(user => user.id === message.author.id) || ""));
    if (!user) {
      let embed = new MessageEmbed()
        .setDescription("👹 Вы не можете использовать данную команду!.")
        .setColor("#eb4034");
      message.reply({embeds: [embed]}).catch(e => e);
      return;
    }

    if (!args[0]) {
      message.reply(`⛔ Неверный формат команды, упомяните или укажите айди пользователя (\`${this.example}\`)`).catch(e => e);
      return;
    }
    let payMember = await getUserFromMention(args[0], message.guild);
    if (!payMember){
      try{
        payMember = await message.guild.members.fetch(args[0]);
      }catch (e) {}
    }
    if (!payMember){
      message.reply("Пользователь не найден.").catch(e => e);
      return;
    }
    let payUser = JSON.parse(JSON.stringify(guild.options.economy.users.find(user => user.id === payMember.id) || ""));
    if (!payUser){
      message.reply("Пользователь не найден.").catch(e => e);
      return;
    }
    if (!args[1] || !["gold", "silver"].includes(args[1])){
      message.reply(`⛔ Неверный формат команды, укажите тип валюты (\`${this.example}\`)`).catch(e => e);
      return;
    }
    if (!args[2]){
      message.reply(`⛔ Неверный формат команды, укажите количество средств для передачи (\`${this.example}\`)`).catch(e => e);
      return;
    }
    switch (args[1]){
      case "gold":
        if (user.goldCoins < +args[2]){
          let embed = new MessageEmbed()
            .setDescription("👹 Недостаточно средств.")
            .setColor("#eb4034");
          message.reply({embeds: [embed]}).catch(e => e);
          return;
        }
        user.goldCoins -= +args[2];
        payUser.goldCoins += +args[2];
        break;
      case "silver":
        if (user.silverCoins < +args[2]){
          let embed = new MessageEmbed()
            .setDescription("👹 Недостаточно средств.")
            .setColor("#eb4034");
          message.reply({embeds: [embed]}).catch(e => e);
          return;
        }
        user.silverCoins -= +args[2];
        payUser.silverCoins += +args[2];
        break;
      default:
        message.reply(`⛔ Ошибка`).catch(e => e);
        return;
    }
    let resultArray = [];
    for (let usr of JSON.parse(JSON.stringify(guild.options.economy.users || []))) {
      if (usr.id === user.id) {
        resultArray.push(user);
        continue;
      }
      if (usr.id === payUser.id){
        resultArray.push(payUser);
        continue;
      }
      resultArray.push(usr);
    }
    guild.options = {...guild.options, economy: {...guild.options.economy, users: resultArray}};
    guild.markModified("options");
    await guild.save();
    let embed = new MessageEmbed()
      .setDescription(`${args[2]}${args[1] === "gold" ? "<:gold_coin:965238193945444372>" : "<:silver_coin:965239170459136041>"} передано <@${payMember.id}>`)
      .setColor("#378f00");
    message.reply({embeds: [embed]}).catch(e => e);
  }
}