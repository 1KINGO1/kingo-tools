const {prefix} = require("../config.json");
const {checkRoles, checkChannels} = require("../utils/checkAvailability");
const getUserFromMention = require("../utils/getUserFromMention");
const calcLevelByXp = require("../utils/calcLevelByXp");
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
      message.reply("Вы не можете использовать эту команду!");
      return;
    }
    ;
    if (!await checkChannels(command, message.channel.id)) {
      message.reply("Вы не можете использовать эту команду здесь!");
      return;
    }

    if (!args[0]) {
      message.reply("Укажите изменяемое свойство");
      return;
    }
    if (!args[1]) {
      message.reply("Укажите айди пользователя или упомяните его");
      return;
    }
    if (!args[2]) {
      message.reply("Укажите устанавливаемое значение");
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
      message.reply("Пользователь не найден.");
      return;
    }

    switch (args[0]){
      case "level":
        try {
          let user = JSON.parse(JSON.stringify(guild.options.levelSystem.users.find(user => user.id === mentionedUser.user.id) || ""));
          if (!user) {
            message.reply("Пользователь не найден.");
            return;
          }
          if (isNaN(+args[2]) || +args[2] <= 0) {
            message.reply("Неверный тип значение, введите **натуральное число**");
            return
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
          await message.reply("Успешно!");
        }catch (e) {await message.reply("Произошла ошибка!");}
        break;

      case "xp":
        try {
          let user = JSON.parse(JSON.stringify(guild.options.levelSystem.users.find(user => user.id === mentionedUser.user.id) || ""));
          if (!user) {
            message.reply("Пользователь не найден.");
            return;
          }
          if (isNaN(+args[2]) || +args[2] <= 0) {
            message.reply("Неверный тип значение, введите **натуральное число**");
            return
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
          await message.reply("Успешно!");
        }catch (e) {await message.reply("Произошла ошибка!");}
        break;

      default:
        message.reply("Свойство не найдено!");
        return;
    }

  }
}