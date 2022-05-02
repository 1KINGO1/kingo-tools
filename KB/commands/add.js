const {prefix} = require("../config.json");
const {checkRoles, checkChannels} = require("../utils/checkAvailability");
const getUserFromMention = require("../utils/getUserFromMention");
const calcLevelByXp = require("../utils/calcLevelByXp");
const {MessageEmbed} = require("discord.js");
let colors = require("../utils/colors");
module.exports = {
  name: "add",
  description: "Добавляет уровень или хр пользователю.",
  example: `${prefix}add [level | xp] [mention | id] [value]`,
  category: "levels",
  execute: async function (message, command, guild) {
    let messageArray = message.content.split(' ');
    let args = messageArray.slice(1);

    let member = await message.guild.members.fetch(message.author.id);
    if (!await checkRoles(command, member)) {
      let embed = new MessageEmbed().setDescription("Вы не можете использовать эту команду!").setColor(colors.grayRed);
      message.reply({embeds: [embed]});
      return;
    }
    if (!await checkChannels(command, message.channel.id)) {
      let embed = new MessageEmbed().setDescription("Вы не можете использовать эту команду здесь!").setColor(colors.grayRed);
      message.reply({embeds: [embed]});
      return;
    }

    if (!args[0]) {
      let embed = new MessageEmbed().setDescription("Укажите изменяемое свойство!").setColor(colors.gray);
      message.reply({embeds: [embed]});
      return;
    }
    if (!args[1]) {
      let embed = new MessageEmbed().setDescription("Укажите айди пользователя или упомяните его!").setColor(colors.gray);
      message.reply({embeds: [embed]});
      return;
    }
    if (!args[2]) {
      let embed = new MessageEmbed().setDescription("Укажите устанавливаемое значение!").setColor(colors.gray);
      message.reply({embeds: [embed]});
      return;
    }

    let mentionedUser = await getUserFromMention(args[1], message.guild);
    if (!mentionedUser) {
      try {
        mentionedUser = await message.guild.members.fetch(args[1]);
      } catch (e) {
      }
    }
    if (!mentionedUser) {
      let embed = new MessageEmbed().setDescription("Пользователь не найден!").setColor(colors.gray);
      message.reply({embeds: [embed]});
      return;
    }

    switch (args[0]){
      case "level":
        try {
          let user = JSON.parse(JSON.stringify(guild.options.levelSystem.users.find(user => user.id === mentionedUser.user.id) || ""));
          if (!user) {
            let embed = new MessageEmbed().setDescription("Пользователь не найден!").setColor(colors.gray);
            message.reply({embeds: [embed]});
            return;
          }
          if (isNaN(+args[2]) || +args[2] <= 0) {
            let embed = new MessageEmbed().setDescription("Неверный тип значение, введите **натуральное число**").setColor(colors.gray);
            message.reply({embeds: [embed]});
            return;
          }
          let statistic = calcLevelByXp(user.totalXP);

          for (let i = 1; i <= +args[2]; i++){
            user.totalXP = user.totalXP + ((statistic.level + i)*2 - 1)*100;
          }

          let resultArray = [];
          for (let usr of JSON.parse(JSON.stringify(guild.options.levelSystem.users))) {
            if (usr.id === user.id) {
              resultArray.push(user);
            } else {
              resultArray.push(usr);
            }
          }
          guild.options = {...guild.options, levelSystem: {...guild.options.levelSystem, users: resultArray}}
          await guild.save();
          let embed = new MessageEmbed().setDescription("Успешно!").setColor(colors.green);
          message.reply({embeds: [embed]});
          return;
        }catch (e) {
          let embed = new MessageEmbed().setDescription("Произошла ошибка!").setColor(colors.grayRed);
          message.reply({embeds: [embed]});
          return;
        }
        break;

      case "xp":
        try {
          let user = JSON.parse(JSON.stringify(guild.options.levelSystem.users.find(user => user.id === mentionedUser.user.id) || ""));
          if (!user) {
            let embed = new MessageEmbed().setDescription("Пользователь не найден!").setColor(colors.gray);
            message.reply({embeds: [embed]});
            return;
          }
          if (isNaN(+args[2]) || +args[2] <= 0) {
            let embed = new MessageEmbed().setDescription("Неверный тип значение, введите **натуральное число**").setColor(colors.gray);
            message.reply({embeds: [embed]});
            return;
          }
          user.totalXP = user.totalXP + +args[2]
          let resultArray = [];
          for (let usr of JSON.parse(JSON.stringify(guild.options.levelSystem.users))) {
            if (usr.id === user.id) {
              resultArray.push(user);
            } else {
              resultArray.push(usr);
            }
          }
          guild.options = {...guild.options, levelSystem: {...guild.options.levelSystem, users: resultArray}}
          await guild.save();
          let embed = new MessageEmbed().setDescription("Успешно!").setColor(colors.green);
          message.reply({embeds: [embed]});
          return;
        }catch (e) {
          let embed = new MessageEmbed().setDescription("Произошла ошибка!").setColor(colors.grayRed);
          message.reply({embeds: [embed]});
          return;
        }
        break;

      default:
        let embed = new MessageEmbed().setDescription("Свойство не найдено!").setColor(colors.grayRed);
        message.reply({embeds: [embed]});
        return;
    }

  }
}