const {prefix} = require("../config.json");
const {checkRoles, checkChannels} = require("../utils/checkAvailability");
const {MessageEmbed} = require("discord.js");
const characters = require("../modules/economy/characters");
const colors = require("../utils/colors");
module.exports = {
  name: "changecharacter",
  description: "Меняет персонажа (все активные усилители пропадут).",
  example: `${prefix}changecharacter [character name]`,
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
        .setDescription("👹 Введите имя героя.")
        .setColor("#eb4034");
      message.reply({embeds: [embed]});
      return;
    }
    let character = characters.find(ch => ch.name === args[0]);
    if (!character){
      let embed = new MessageEmbed()
        .setDescription("👹 Герой не найден.")
        .setColor("#eb4034");
      message.reply({embeds: [embed]});
      return;
    }
    if (user.silverCoins < character.silverPrice || user.goldCoins < character.goldPrice){
      let embed = new MessageEmbed()
        .setDescription("👹 Недостаточно средств.")
        .setColor("#eb4034");
      message.reply({embeds: [embed]});
      return;
    }
    user.silverCoins -= character.silverPrice;
    user.goldCoins -= character.goldPrice;
    user.selectedCharacter = character.name;
    user.swordDamage = character.swordDamage;
    user.bowDamage = character.bowDamage;
    user.magicDamage = character.magicDamage;
    user.hp = character.hp;
    user.defence = character.defence;
    let resultArray = [];
    for (let usr of JSON.parse(JSON.stringify(guild.options.economy.users || []))) {
      if (usr.id === user.id) {
        resultArray.push(user);
      } else {
        resultArray.push(usr);
      }
    }
    guild.options = {...guild.options, economy: {...guild.options.economy, users: resultArray}};
    await guild.save();
    let embed = new MessageEmbed()
      .setDescription("Персонаж сменён!")
      .setColor("#378f00");
    message.reply({embeds: [embed]});
  }
}