const {prefix} = require("../config.json");
const {checkRoles, checkChannels} = require("../utils/checkAvailability");
const getUserFromMention = require("../utils/getUserFromMention");
const {MessageEmbed} = require("discord.js");
const calcLevelByXp = require("../utils/calcLevelByXp");
const moment = require("moment");
moment.locale("ru");
module.exports = {
  name: "info",
  description: "Показывает информацию о пользователе .",
  example: `${prefix}info [?mention or id]`,
  category: "utils",
  execute: async function(message, command, dbGuild){
    let messageArray = message.content.split(' ');
    let args = messageArray.slice(1);
    let guild = message.guild;
    let member = await guild.members.fetch(message.author.id);
    if (!await checkRoles(command, member)){
      message.reply("Вы не можете использовать эту команду!");
      return;
    };
    if (!await checkChannels(command, message.channel.id)){
      message.reply("Вы не можете использовать эту команду здесь!");
      return;
    }

    let user = member;

    if (args[0]){
      let mentionedUser = await getUserFromMention(args[0], guild);
      if (!mentionedUser){
        try{
          mentionedUser = await guild.members.fetch(args[0]);
        }catch (e) {}
      }
      if (!mentionedUser){
        message.reply("Пользователь не найден.");
        return;
      }
      else{
        user = mentionedUser;
      }
    }

    const embed = new MessageEmbed()
      .setColor(user.roles?.highest?.hexColor || "#7f6ce5")
      .setAuthor({name: `${user.displayName} ( ${user.user.tag} )`, iconURL: user.user.displayAvatarURL({size:1024,dynamic:true})})
      .setFooter(`ID: ${user.user.id}`)
      .setThumbnail(user.user.displayAvatarURL({size:1024,dynamic:true}));
    embed.addField("Роли", user.roles.cache.filter(role => role.name !== "@everyone").map(role => `<@&${role.id}>`).join(" "));
    embed.addField("Аккаунт создан:", moment(user.user.createdAt).format('LLLL'));
    embed.addField("Зашел на сервер:", moment(user.joinedAt).format('LLLL'));

    let dbUser = JSON.parse(JSON.stringify(dbGuild.options.levelSystem.users.find(usr => usr.id === user.user.id) || ""));
    if (dbGuild.options.levelSystem.on && dbUser){
      embed.addField("Уровни:", `Уровень: \`${calcLevelByXp(dbUser.totalXP).level}\`\nXP: \`${dbUser.totalXP}\`\nПрогресс: \`${calcLevelByXp(dbUser.totalXP).levelFarmed}/${calcLevelByXp(dbUser.totalXP).levelNeedFarm}\``);
    }

    await message.reply({embeds: [embed]}).catch(e => {})
  }
}