const {prefix} = require("../config.json");
const {checkRoles, checkChannels} = require("../utils/checkAvailability");
const getUserFromMention = require("../utils/getUserFromMention");
const {MessageEmbed} = require("discord.js");
const colors = require("../utils/colors");
module.exports = {
  name: "set",
  description: "Изменяет уровень или хр пользователя.",
  example: `${prefix}set [level | xp] [mention | id] [value]`,
  category: "levels",
  execute: async function (message, command, guild) {
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

    if (!args[0]) {
      let embed = new MessageEmbed().setDescription("Укажите изменяемое свойство!").setColor(colors.grayRed);
      message.reply({embeds: [embed]}).catch(e => e);
      return;
    }
    if (!args[1]) {
      let embed = new MessageEmbed().setDescription("Укажите айди пользователя или упомяните его!").setColor(colors.grayRed);
      message.reply({embeds: [embed]}).catch(e => e);
      return;
    }
    if (!args[2]) {
      let embed = new MessageEmbed().setDescription("Укажите устанавливаемое значение!").setColor(colors.grayRed);
      message.reply({embeds: [embed]}).catch(e => e);
      return;
    }

    let mentionedUser = await getUserFromMention(args[1], message.guild);
    if (!mentionedUser) {
      try {
        mentionedUser = await message.guild.members.fetch(args[1]).catch(e => e);
      } catch (e) {
      }
    }
    if (!mentionedUser) {
      let embed = new MessageEmbed().setDescription("Пользователь не найден!").setColor(colors.gray);
      message.reply({embeds: [embed]}).catch(e => e);
      return;
    }

    switch (args[0]){
      case "level":
        try {
          let user = JSON.parse(JSON.stringify(guild.options.levelSystem.users.find(user => user.id === mentionedUser.user.id) || ""));
          if (!user) {
            let embed = new MessageEmbed().setDescription("Пользователь не найден!").setColor(colors.gray);
            message.reply({embeds: [embed]}).catch(e => e);
            return;
          }
          if (isNaN(+args[2]) || +args[2] <= 0) {
            let embed = new MessageEmbed().setDescription("Неверный тип значение, введите **натуральное число**").setColor(colors.grayRed);
            message.reply({embeds: [embed]}).catch(e => e);
            return;
          }
          user.totalXP = ((+args[2] -1 ) ** 2) * 100
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
          message.reply({embeds: [embed]}).catch(e => e);
          return;
        }catch (e) {
          let embed = new MessageEmbed().setDescription("Произошла ошибка!").setColor(colors.gray);
          message.reply({embeds: [embed]}).catch(e => e);
          return
        }
        break;

      case "xp":
        try {
          let user = JSON.parse(JSON.stringify(guild.options.levelSystem.users.find(user => user.id === mentionedUser.user.id) || ""));
          if (!user) {
            let embed = new MessageEmbed().setDescription("Пользователь не найден!").setColor(colors.gray);
            message.reply({embeds: [embed]}).catch(e => e);
            return;
          }
          if (isNaN(+args[2]) || +args[2] <= 0) {
            let embed = new MessageEmbed().setDescription("Неверный тип значение, введите **натуральное число**").setColor(colors.grayRed);
            message.reply({embeds: [embed]}).catch(e => e);
            return;
          }
          user.totalXP = +args[2]
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
          message.reply({embeds: [embed]}).catch(e => e);
          return;
        }catch (e) {
          let embed = new MessageEmbed().setDescription("Произошла ошибка!").setColor(colors.gray);
          message.reply({embeds: [embed]}).catch(e => e);
          return
        }
        break;

      default:
        let embed = new MessageEmbed().setDescription("Свойство не найдено!").setColor(colors.gray);
        message.reply({embeds: [embed]}).catch(e => e);
        return
    }

  }
}