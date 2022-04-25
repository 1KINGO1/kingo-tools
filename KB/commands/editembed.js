const {prefix} = require("../config.json");
const {checkRoles, checkChannels} = require("../utils/checkAvailability");
const axios = require("axios");
const iconv = require("iconv-lite");
const {MessageEmbed} = require("discord.js");
module.exports = {
  name: "editembed",
  description: "Изменяет любой embed отправленый ботом",
  example: `${prefix}editembedembed [channel_id/message_id] [.txt file]`,
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
      message.reply("Укажите ссылку на сообщение \`channel_id/message_id\`!");
      return;
    }
    let [channel_id, message_id] = args[0].split("/");
    if (!channel_id || !message_id){
      message.reply("Укажите ссылку на сообщение \`channel_id/message_id\`!");
      return;
    }
    let channelObj = await client.channels.fetch(channel_id);
    if (!channelObj || channelObj?.guild.id !== guild.id){
      message.reply("Канал не найден!");
      return;
    }
    let messageObj = await channelObj.messages.fetch(message_id);
    if (!messageObj){
      message.reply("Сообщение не найдено!");
      return;
    }
    if (messageObj.embeds.length === 0){
      message.reply("Изменять можно только embed сообщения!");
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
    let text = iconv.decode(Buffer.from(response.data), "utf-8");
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
      await messageObj.edit({embeds: embed});
      message.reply("Успешно!")
    }catch (e) {}
  }
}