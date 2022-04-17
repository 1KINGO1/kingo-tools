const {prefix} = require('../config.json');
const {checkRoles, checkChannels} = require("../utils/checkAvailability");
const getUserFromMention = require("../utils/getUserFromMention");
const dateParser = require("../utils/dateParser");
const logger = require("../modules/logger");
const moment = require("moment");
moment.locale("de");

module.exports = {
  name: "timeout",
  alternative: ["tm"],
  description: "Мутит пользователя на сервере.",
  example: `${prefix}timeout [mention or id] [time] [?reason]`,
  category: "mod",
  execute: async function(message, command, dbGuild){
    let messageArray = message.content.split(' ');
    let args = messageArray.slice(1);
    let guild = message.guild;
    let member = await guild.members.fetch(message.author.id);
    if (!await checkRoles(command, member)){
      message.reply("Вы не можете мутить пользователей!");
      return;
    };
    if (!await checkChannels(command, message.channel.id)){
      message.reply("Вы не можете использовать эту команду здесь!");
      return;
    }

    if (!args[0]){
      message.reply(`⛔ Неверный формат команды, упомяните или укажите айди пользователя (\`${this.example}\`)`);
      return;
    }
    if (!args[1]){
      message.reply(`⛔ Неверный формат команды, укажите срок наказания (\`${this.example}\`)`);
      return;
    }

    let banMember = await getUserFromMention(args[0], guild);
    if (!banMember){
      try{
        banMember = await guild.members.fetch(args[0]);
      }catch (e) {}
    }
    if (!banMember){
      message.reply("Пользователь не найден.");
      return;
    }

    let time;
    try{
      time = dateParser(args[1]);
    }catch (e) {
      message.reply("⛔ Неверный формат даты");
      return;
    }

    let banMemberRolePosition = banMember.roles.cache.reduce((prev, item) => item.position > prev ? item.position : prev, -1);
    let authorRolePosition = member.roles.cache.reduce((prev, item) => item.position > prev ? item.position : prev, -1);

    if (banMemberRolePosition >= authorRolePosition && member.id !== guild.ownerId){
      message.reply("⛔ Вы не можете мутить пользователя, который имеет позицию роли выше вашей!");
      return;
    }

    try{
      await banMember.timeout(time, args[2] || "Без причины")
      await message.reply(`${banMember.user.tag} был замучен ✅`);
      await logger(dbGuild, {type: "TIMEOUT", category: "mod", offender: banMember.user, name: "timeout", reason: args[2] || "Без причины", mod: message.author})
    }catch (e){
      message.reply(`Не удалось замутить ${banMember.user.tag} ❌`);
    }
  }
}