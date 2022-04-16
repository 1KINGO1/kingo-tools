const {prefix} = require('../config.json');
const {checkRoles, checkChannels} = require("../utils/checkAvailability");
const getUserFromMention = require("../utils/getUserFromMention");
const dateParser = require("../utils/dateParser");
const moment = require("moment");
moment.locale("de");

module.exports = {
  name: "removetimeout",
  alternative: ["rtm"],
  description: "Размутит пользователя на сервере.",
  example: `${prefix}rtm [mention or id]`,
  category: "mod",
  execute: async function(message, command){
    let messageArray = message.content.split(' ');
    let args = messageArray.slice(1);
    let guild = message.guild;
    let member = await guild.members.fetch(message.author.id);
    if (!await checkRoles(command, member)){
      message.reply("Вы не можете размучивать пользователей!");
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

    let banMemberRolePosition = banMember.roles.cache.reduce((prev, item) => item.position > prev ? item.position : prev, -1);
    let authorRolePosition = member.roles.cache.reduce((prev, item) => item.position > prev ? item.position : prev, -1);

    if (banMemberRolePosition >= authorRolePosition && member.id !== guild.ownerId){
      message.reply("⛔ Вы не можете размутить пользователя, который имеет позицию роли выше вашей!");
      return;
    }

    try{
      await banMember.timeout(0, "Размут")
      message.reply(`${banMember.user.tag} был размучен ✅`);
    }catch (e){
      message.reply(`Не удалось замутить ${banMember.user.tag} ❌`);
    }
  }
}