const {prefix} = require("../config.json");
const {checkRoles, checkChannels} = require("../utils/checkAvailability");
const axios = require("axios");
const iconv = require("iconv-lite");
const {MessageEmbed} = require("discord.js");
module.exports = {
  name: "embed",
  description: "Отправляет embed в канал",
  example: `${prefix}embed [channel id] [.txt file]`,
  category: "utils",
  execute: async function(message, command, guild, client) {
    let messageArray = message.content.split(' ');
    let args = messageArray.slice(1);

    let member = await message.guild.members.fetch(message.author.id);
    if (!await checkRoles(command, member)) {
      message.reply("Вы не можете использовать эту команду!");
      return;
    };
    if (!await checkChannels(command, message.channel.id)) {
      message.reply("Вы не можете использовать эту команду здесь!");
      return;
    }
    if (!args[0]) {
      message.reply("Укажите айди канала для отправки!");
      return;
    }
    const file = message.attachments.first()?.url;
    if (!file){
      return message.reply("Добавте файл с конфигом embed!");
    }
    const response = await axios.get(file,  {
      responseType: 'arraybuffer',
      responseEncoding: 'binary'
    });
    if (response.status !== 200){
      return message.reply("Неудалось прочитать файл!");
    }
    let text = iconv.decode(Buffer.from(response.data), "win1251");
    try{
      text = JSON.parse(text);
    }catch (e) {
      return message.reply("Конфиг embed должен быть в формате JSON!");
    }
    if (!text){
      message.reply("Конфиг embed должен быть в формате JSON!");
    }
    try{
      let embed;
      if (text instanceof Array){
        embed = text.map(embed => new MessageEmbed(embed));
      }
      else{
        embed = [new MessageEmbed(text)];
      }
      let channel = await client.channels.fetch(args[0]);
      await channel.send({embeds: embed});
      message.reply("Успешно!")
    }catch (e) {}
  }
}