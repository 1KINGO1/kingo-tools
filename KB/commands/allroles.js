const {prefix} = require("../config.json");
const {checkRoles, checkChannels} = require("../utils/checkAvailability");
const dateParser = require("../utils/dateParser");
const {Reminds, Guild} = require("../main");
const {MessageEmbed} = require("discord.js");
let colors = require("../utils/colors");
const getUserFromMention = require("../utils/getUserFromMention");
module.exports = {
  name: "timerole",
  description: "Даёт роль на время.",
  example: `${prefix}timerole [user] [role id] [time]`,
  alternative: ["tr"],
  category: "roles",
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

    let embed = new MessageEmbed()
      .setTitle(`Все роли ${message.guild.name}`)
      .setColor(colors.blue)
      .setDescription(message.guild.roles.cache
        .sort((role1, role2) => role2.position - role1.position)
        .filter(role => role.id !== message.guild.roles.everyone.id)
        .map((role, id) => `${role.position}. <@&${id}> (${id})`)
        .slice(0,100)
        .join("\n")).setTimestamp(new Date())
        .setFooter(`Первые 100 ролей`);
    message.reply({embeds: [embed]}).catch(e => e);
  }
}