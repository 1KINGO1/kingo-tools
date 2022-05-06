const {prefix} = require("../config.json");
const {checkRoles, checkChannels} = require("../utils/checkAvailability");
const {MessageEmbed} = require("discord.js");
const colors = require("../utils/colors");
module.exports = {
  name: "customcommand",
  description: "Показывает информацию о команде.",
  example: `${prefix}customcommand [name]`,
  category: "config",
  execute: async function(message, command, guild) {
    let member = await message.guild.members.fetch(message.author.id);
    let messageArray = message.content.split(' ');
    let args = messageArray.slice(1);
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
      let embed = new MessageEmbed()
        .setDescription("Укажите имя команды!")
        .setColor(colors.grayRed);
      return message.reply({embeds: [embed]}).catch(e => e);
    }

    let ccomand = JSON.parse(JSON.stringify(guild.options.customCommands.find(c => c.name === args.join()) || ""));
    if (!ccomand){
      let embed = new MessageEmbed()
        .setDescription("Команда не найдена!")
        .setColor(colors.gray);
      return message.reply({embeds: [embed]}).catch(e => e);
    }
    let embed = new MessageEmbed()
      .setTitle(`Команда ${ccomand.name}`)
      .setDescription(`**Канал отправки**: ${+ccomand.sendChannel ? `<#${ccomand.sendChannel}>` : `\`${ccomand.sendChannel}\``}
      **Whitelist роли**: ${ccomand.rolesWhiteList.map(c => +c ? `<@&${c}>` : `\`${c}\``).join(" ")}
      **Whitelist каналы**: ${ccomand.channelWhiteList.map(c => +c ? `<#${c}>` : `\`${c}\``).join(" ")}
      **Контент**: \n\`\`\`json\n${ccomand.text}\`\`\``)
      .setColor(colors.purple);
    return message.reply({embeds: [embed]}).catch(e => e);
  }
}