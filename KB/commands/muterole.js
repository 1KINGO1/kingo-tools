const {prefix} = require("../config.json");
const {checkRoles, checkChannels} = require("../utils/checkAvailability");
const {MessageEmbed} = require("discord.js");
const colors = require("../utils/colors");
module.exports = {
  name: "muterole",
  description: "Устанавливает роль мута.",
  example: `${prefix}muterole [role id]`,
  category: "config",
  execute: async function(message, command, dbGuild) {
    let member = await message.guild.members.fetch(message.author.id);
    let messageArray = message.content.split(' ');
    let args = messageArray.slice(1);
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
    if (!args[0] || !+args[0]) {
      let embed = new MessageEmbed()
        .setDescription("Укажите айди роли!")
        .setColor(colors.grayRed);
      return message.reply({embeds: [embed]}).catch(e => e);
    }

    dbGuild.options = {...dbGuild.options, mute: {...dbGuild.options.mute, role: args[0]}};
    dbGuild.markModified("options");
    await dbGuild.save();
    let embed = new MessageEmbed().setDescription(`Роль изменена!`).setColor(colors.green);
    message.reply({embeds: [embed]}).catch(e => e);
  }
}