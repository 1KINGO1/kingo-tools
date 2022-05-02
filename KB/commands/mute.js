const {prefix} = require('../config.json');
const {Guild} = require("../main");
const {checkRoles, checkChannels} = require("../utils/checkAvailability");
const getUserFromMention = require("../utils/getUserFromMention");
const dateParser = require("../utils/dateParser");
const logger = require("../modules/loggerMod");
const moment = require("moment");
const {SlashCommandBuilder} = require("@discordjs/builders");
const {MessageEmbed} = require("discord.js");
const calcLevelByXp = require("../utils/calcLevelByXp");
const characters = require("../modules/economy/characters");
const colors = require("../utils/colors");
moment.locale("de");

module.exports = {
  name: "mute",
  alternative: ["m"],
  description: "Мутит пользователя на сервере.",
  example: `${prefix}mute [mention or id] [time] [?reason]`,
  category: "mod",
  execute: async function (message, command, dbGuild, client) {
    let messageArray = message.content.split(' ');
    let args = messageArray.slice(1);
    let guild = message.guild;
    let member = await guild.members.fetch(message.author.id);
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

    if (!args[0]) {
      message.reply(`⛔ Неверный формат команды, упомяните или укажите айди пользователя (\`${this.example}\`)`);
      return;
    }
    if (!args[1]) {
      message.reply(`⛔ Неверный формат команды, укажите срок наказания (\`${this.example}\`)`);
      return;
    }

    let role;
    try{
      role = await guild.roles.cache.find(r => r.id === dbGuild.options.mute.role);
    }catch (e) {
      let embed = new MessageEmbed().setDescription("Роль для мута не найдена!").setColor(colors.grayRed);
      message.reply({embeds: [embed]});
      return;
    }

    let banMember = await getUserFromMention(args[0], guild);
    if (!banMember) {
      try {
        banMember = await guild.members.fetch(args[0]);
      } catch (e) {}
    }
    if (!banMember) {
      message.reply("Пользователь не найден.");
      return;
    }

    let time;
    try {
      time = dateParser(args[1]);
    } catch (e) {
      message.reply("⛔ Неверный формат даты");
      return;
    }
    if (dbGuild.options.mute.users.find(u => u.id === banMember.id)){
      message.reply(`⛔ Пользователь уже в муте!`);
      return;
    }

    let banMemberRolePosition = banMember.roles.cache.reduce((prev, item) => item.position > prev ? item.position : prev, -1);
    let authorRolePosition = member.roles.cache.reduce((prev, item) => item.position > prev ? item.position : prev, -1);

    if (banMemberRolePosition >= authorRolePosition && member.id !== guild.ownerId) {
      message.reply("⛔ Вы не можете мутить пользователя, который имеет позицию роли выше вашей!");
      return;
    }

    if (banMember.id === message.author.id){
      let embed = new MessageEmbed().setDescription(`⛔ Вы не можете мутить себя!`).setColor(colors.grayRed);
      message.reply({embeds: [embed]});
      return;
    }

    try {
      let mute = {
        id: banMember.id,
        to: new Date().getTime() + time
      };
      dbGuild.options = {...dbGuild.options, mute: {...dbGuild.options.mute, users: [...dbGuild.options.mute.users, mute]}};
      dbGuild.markModified("options");
      await dbGuild.save();
      await banMember.roles.add(role);

      await logger(dbGuild, {
        type: "MUTE",
        category: "mod",
        offender: banMember.user,
        name: "mute",
        reason: args.slice(2,).join(" ") || "Без причины",
        duration: time,
        mod: message.author
      }, client);

      setTimeout(async () => {
        try{
          dbGuild = await Guild.findOne({id: dbGuild.id});
          console.log(dbGuild.options.mute.users)
          if (!dbGuild.options.mute.users.find(u => u.id === banMember.id)){
            return;
          }
          await banMember.roles.remove(dbGuild.options.mute.role);
          let resultArr = [];
          for (let banUser of JSON.parse(JSON.stringify(dbGuild.options.mute.users))){
            if (banUser.id === banMember.id) continue;
            resultArr.push(banUser);
          }
          dbGuild.options = {...dbGuild.options, mute: {...dbGuild.options.mute, users: resultArr}};
          dbGuild.markModified("options");
          await dbGuild.save();
          await logger(dbGuild, {
            type: "MUTE_REMOVE",
            category: "mod",
            offender: banMember.user,
            name: "unmute",
            reason: "Истёк срок",
            mod: client.user
          }, client)
        }catch (e) {console.log(e)}
      }, time);

      await message.reply(`${banMember.user.tag} был замучен ✅`);
    } catch (e) {
      console.log(e)
      message.reply(`Не удалось замутить ${banMember.user.tag} ❌`);
    }
  }
}