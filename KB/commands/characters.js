const {prefix} = require("../config.json");
const characters = require("../modules/economy/characters");
const {checkRoles, checkChannels} = require("../utils/checkAvailability");
const {MessageEmbed} = require("discord.js");
module.exports = {
  name: "characters",
  description: "Показывает список всех достурных персонажей.",
  example: `${prefix}characters`,
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
        .setDescription("👹 Работать можно только с подземелья.")
        .setColor("#eb4034");
      message.reply({embeds: [embed]});
      return;
    }

    let embed = new MessageEmbed()
      .setTitle("Список всех доступных героев")
      .setColor("#378f00");
    characters.forEach(character => embed.addField(character.name + " " + character.icon, `${character.description}\nУрон мечём: \`${character.swordDamage}\`\nУрон луком: \`${character.bowDamage}\`\nУрон магией: \`${character.magicDamage}\`\nЗдоровье: \`${character.hp}\`\nБроня: \`${character.defence}\`\nСтоимость смены: **${character.goldPrice ? character.goldPrice + "<:gold_coin:965238193945444372>" : character.silverPrice ? character.silverPrice + "<:silver_coin:965239170459136041>" : "Бесплатно"}**\n`));
    message.reply({embeds: [embed]});
    return;
  }

}