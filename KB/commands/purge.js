const {prefix} = require("../config.json");
const {checkRoles, checkChannels} = require("../utils/checkAvailability");
const dateParser = require("../utils/dateParser");
const {Reminds, Guild} = require("../main");
const {MessageEmbed} = require("discord.js");
let colors = require("../utils/colors");
const getUserFromMention = require("../utils/getUserFromMention");
module.exports = {
  name: "purge",
  description: "Удаляет сообщения в канале.",
  example: `${prefix}purge [amount]`,
  category: "utils",
  execute: async function (message, command, dbGuild, client) {
    let messageArray = message.content.split(' ');
    let args = messageArray.slice(1);
    let guild = message.guild;
    let member = await guild.members.fetch(message.author.id);
    let channel = message.channel;
    if (!await checkRoles(command, member)) {
      let embed = new MessageEmbed().setDescription("Вы не можете использовать эту команду!").setColor(colors.grayRed);
      message.reply({embeds: [embed]});
      return;
    }
    if (!await checkChannels(command, message.channel.id)) {
      let embed = new MessageEmbed().setDescription("Вы не можете использовать эту команду здесь!").setColor(colors.grayRed);
      message.reply({embeds: [embed]});
      return;
    }
    if (!args[0] || !+args[0]) {
      let embed = new MessageEmbed().setDescription(`Неверный формат команды! (\`${this.example}\`)`).setColor(colors.grayRed);
      message.reply({embeds: [embed]});
      return;
    }
    if (+args[0] < 1 || +args[0] > 100){
      let embed = new MessageEmbed().setDescription(`Укажите число в диапазоне от 1 до 100.`).setColor(colors.grayRed);
      message.reply({embeds: [embed]});
      return;
    }
    try{
      await message.channel.bulkDelete(+args[0]);
      let embed = new MessageEmbed().setDescription(`Успешно!`).setColor(colors.green);
      channel.send({embeds: [embed]});
      return;
    }
    catch(e){
      let embed = new MessageEmbed().setDescription(`Не удалось очистить сообщения.`).setColor(colors.gray);
      channel.send({embeds: [embed]});
      return;
    }
  }
}