const {prefix} = require('../config.json');
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
  name: "unmute",
  alternative: ["um"],
  description: "Уберает мут пользователя на сервере.",
  example: `${prefix}unmute [mention or id] [time] [?reason]`,
  category: "mod",
  execute: async function (message, command, dbGuild, client) {
    let messageArray = message.content.split(' ').filter(a => a.trim());
    let args = messageArray.slice(1);
    let guild = message.guild;
    let member = await guild.members.fetch(message.author.id);
    if (!await checkRoles(command, member)) {
      let embed = new MessageEmbed().setDescription("Вы не можете использовать эту команду!").setColor(colors.grayRed);
      message.reply({embeds: [embed]}).catch(e => e);
      return;
    }
    if (!await checkChannels(command, message.channel.id)) {
      let embed = new MessageEmbed().setDescription("Вы не можете использовать эту команду здесь!").setColor(colors.grayRed);
      message.reply({embeds: [embed]}).catch(e => e);
      return;
    }

    if (!args[0]) {
      message.reply(`⛔ Неверный формат команды, упомяните или укажите айди пользователя (\`${this.example}\`)`).catch(e => e);
      return;
    }

    let role;
    try {
      role = await guild.roles.cache.find(r => r.id === dbGuild.options.mute.role);
    } catch (e) {
      let embed = new MessageEmbed().setDescription("Роль для мута не найдена!").setColor(colors.grayRed);
      message.reply({embeds: [embed]}).catch(e => e);
      return;
    }

    let banMember = await getUserFromMention(args[0], guild);
    if (!banMember) {
      try {
        banMember = await guild.members.fetch(args[0]).catch(e => e);
      } catch (e) {
      }
    }
    if (!banMember) {
      message.reply("Пользователь не найден.").catch(e => e);
      return;
    }

    let banMemberRolePosition = banMember.roles.cache.reduce((prev, item) => item.position > prev ? item.position : prev, -1);
    let authorRolePosition = member.roles.cache.reduce((prev, item) => item.position > prev ? item.position : prev, -1);

    if (banMemberRolePosition >= authorRolePosition && member.id !== guild.ownerId) {
      message.reply("⛔ Вы не можете размучивать пользователя, который имеет позицию роли выше вашей!").catch(e => e);
      return;
    }

    if (banMember.id === message.author.id) {
      let embed = new MessageEmbed().setDescription(`⛔ Вы не можете размутить себя!`).setColor(colors.grayRed);
      message.reply({embeds: [embed]}).catch(e => e);
      return;
    }

    if (!dbGuild.options.mute.users.find(u => u.id === banMember.id)){
      message.reply(`⛔ Пользователь не в муте!`).catch(e => e);
      return;
    }

    try {
      await banMember.roles.remove(dbGuild.options.mute.role);
      let resultArr = [];
      for (let banUser of JSON.parse(JSON.stringify(dbGuild.options.mute.users))) {
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
        reason: args.slice(1,).join(" ") || "Без причины",
        mod: client.user
      }, client)
      await message.reply(`${banMember.user.tag} был размучен ✅`).catch(e => e);
    }
    catch (e) {message.reply(`Не удалось размутить ${banMember.user.tag} ❌`).catch(e => e)};
  }
}