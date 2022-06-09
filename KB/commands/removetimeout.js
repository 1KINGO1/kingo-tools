const {prefix} = require('../config.json');
const {checkRoles, checkChannels} = require("../utils/checkAvailability");
const getUserFromMention = require("../utils/getUserFromMention");
const dateParser = require("../utils/dateParser");
const moment = require("moment");
const logger = require("../modules/loggerMod");
const {MessageEmbed} = require("discord.js");
const colors = require("../utils/colors");
moment.locale("de");

module.exports = {
  name: "removetimeout",
  alternative: ["rtm"],
  description: "Размутит пользователя на сервере.",
  example: `${prefix}rtm [mention or id]`,
  category: "mod",
  execute: async function(message, command, dbGuild, client){
    let messageArray = message.content.split(' ').filter(a => a.trim());
    let args = messageArray.slice(1);
    let guild = message.guild;
    let member = await guild.members.fetch(message.author.id);
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

    if (!args[0]){
      let embed = new MessageEmbed().setDescription(`⛔ Неверный формат команды, упомяните или укажите айди пользователя (\`${this.example}\`)`).setColor(colors.grayRed);
      message.reply({embeds: [embed]}).catch(e => e);
      return;
    }

    let banMember = await getUserFromMention(args[0], guild);
    if (!banMember){
      try{
        banMember = await guild.members.fetch(args[0]);
      }catch (e) {}
    }
    if (!banMember){
      let embed = new MessageEmbed().setDescription("Пользователь не найден!").setColor(colors.gray);
      message.reply({embeds: [embed]}).catch(e => e);
      return;
    }

    let banMemberRolePosition = banMember.roles.cache.reduce((prev, item) => item.position > prev ? item.position : prev, -1);
    let authorRolePosition = member.roles.cache.reduce((prev, item) => item.position > prev ? item.position : prev, -1);

    if (banMemberRolePosition >= authorRolePosition && member.id !== guild.ownerId){
      let embed = new MessageEmbed().setDescription("⛔ Вы не можете размутить пользователя, который имеет позицию роли выше вашей!").setColor(colors.grayRed);
      message.reply({embeds: [embed]}).catch(e => e);
      return;
    }

    if (banMember.id === message.author.id){
      let embed = new MessageEmbed().setDescription(`⛔ Вы не можете размутить себя!`).setColor(colors.grayRed);
      message.reply({embeds: [embed]}).catch(e => e);
      return;
    }

    try{
      await banMember.timeout(0, "Размут")
      let embed = new MessageEmbed().setDescription(`${banMember.user.tag} был размучен ✅`).setColor(colors.green);
      message.reply({embeds: [embed]}).catch(e => e);
      await logger(dbGuild, {type: "TIMEOUT_REMOVE", category: "mod", offender: banMember.user, name: "timeout remove", reason: args[2] || "Без причины", mod: message.author}, client)
    }catch (e){
      let embed = new MessageEmbed().setDescription(`Не удалось замутить ${banMember.user.tag} ❌`).setColor(colors.gray);
      message.reply({embeds: [embed]}).catch(e => e);
    }
  }
}