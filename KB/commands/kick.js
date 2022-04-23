const {prefix} = require("../config.json");
const {checkRoles, checkChannels} = require("../utils/checkAvailability");
const getUserFromMention = require("../utils/getUserFromMention");
const logger = require("../modules/loggerMod");
module.exports = {
  name: "kick",
  description: "Кикает пользователя на сервере.",
  example: `${prefix}kick [mention or id] [?reason]`,
  category: "mod",
  execute: async function(message, command, dbGuild, client){
    let messageArray = message.content.split(' ');
    let args = messageArray.slice(1);
    let guild = message.guild;
    let member = await guild.members.fetch(message.author.id);
    if (!await checkRoles(command, member)){
      message.reply("Вы не можете кикать пользователей!");
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
      message.reply("⛔ Вы не можете кикнуть пользователя, который имеет позицию роли выше вашей!");
      return;
    }

    try{
      await guild.members.kick(banMember.id, args[1] || "Без причины");
      message.reply(`${banMember.user.tag} был кикнут ✅`);
      await logger(dbGuild, {type: "KICK", category: "mod", offender: banMember.user, name: "kick", reason: args[1] || "Без причины", mod: message.author}, client)
    }catch (e){
      message.reply(`Не удалось кикнуть ${banMember.user.tag} ❌`);
    }
  }
}