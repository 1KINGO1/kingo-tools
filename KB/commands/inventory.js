const {prefix} = require("../config.json");
const {checkRoles, checkChannels} = require("../utils/checkAvailability");
const {MessageEmbed, MessageActionRow, MessageButton} = require("discord.js");
const items = require("../modules/economy/items");
const colors = require("../utils/colors");
module.exports = {
  name: "inventory",
  description: "Показывает инвентарь.",
  example: `${prefix}inventory`,
  category: "economy",
  execute: async function (message, command, guild) {
    if (!guild.options.economy.on) return;
    let messageArray = message.content.split(' ');
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
    let user = JSON.parse(JSON.stringify(guild.options.economy.users.find(user => user.id === message.author.id) || ""));
    if (!user) {
      let embed = new MessageEmbed()
        .setDescription("👹 Вы не можете использовать данную команду!.")
        .setColor("#eb4034");
      message.reply({embeds: [embed]}).catch(e => e);
      return;
    }
    let embed = new MessageEmbed()
      .setTitle(`Инвентарь ${message.author.tag}`)
      .setColor("#378f00");
    user.inventory.forEach(item => {
      embed.addField(`${item.name} ${item.icon}`, `Количество:  ${item.amount}`)
    })
    if (user.inventory.length === 0){
      embed.setDescription("Здесь пусто :(")
    }
    message.reply({embeds: [embed]}).catch(e => e);
  }
}