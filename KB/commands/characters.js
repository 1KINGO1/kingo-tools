const {prefix} = require("../config.json");
const characters = require("../modules/economy/characters");
const {checkRoles, checkChannels} = require("../utils/checkAvailability");
const {MessageEmbed} = require("discord.js");
const colors = require("../utils/colors");
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

    let embed = new MessageEmbed()
      .setTitle("Список всех доступных героев")
      .setColor("#378f00");
    characters.forEach(character => embed.addField(character.name + " " + character.icon, `${character.description}\nУрон мечём: \`${character.swordDamage}\`\nУрон луком: \`${character.bowDamage}\`\nУрон магией: \`${character.magicDamage}\`\nЗдоровье: \`${character.hp}\`\nБроня: \`${character.defence}\`\nСтоимость смены: **${character.goldPrice ? character.goldPrice + "<:gold_coin:965238193945444372>" : character.silverPrice ? character.silverPrice + "<:silver_coin:965239170459136041>" : "Бесплатно"}**\n`));
    message.reply({embeds: [embed]}).catch(e => e) ;
    return;
  }

}