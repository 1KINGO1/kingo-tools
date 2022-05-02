const {prefix} = require("../config.json");
const {checkRoles, checkChannels} = require("../utils/checkAvailability");
const axios = require("axios");
const iconv = require("iconv-lite");
const {MessageEmbed} = require("discord.js");
const colors = require("../utils/colors");
module.exports = {
  name: "editembed",
  description: "Изменяет любой embed отправленый ботом",
  example: `${prefix}editembedembed [channel_id/message_id] [.txt file]`,
  category: "utils",
  execute: async function(message, command, guild, client) {
    let messageArray = message.content.split(' ');
    let args = messageArray.slice(1);

    let member = await message.guild.members.fetch(message.author.id);
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
      let embed = new MessageEmbed().setDescription("Укажите ссылку на сообщение \`channel_id/message_id\`!").setColor(colors.grayRed);
      message.reply({embeds: [embed]});
      return;
    }
    let [channel_id, message_id] = args[0].split("/");
    if (!channel_id || !message_id){
      let embed = new MessageEmbed().setDescription("Укажите ссылку на сообщение \`channel_id/message_id\`!").setColor(colors.grayRed);
      message.reply({embeds: [embed]});
      return;
    }
    let channelObj = await client.channels.fetch(channel_id);
    if (!channelObj || channelObj?.guild.id !== guild.id){
      let embed = new MessageEmbed().setDescription("Канал не найден!").setColor(colors.gray);
      message.reply({embeds: [embed]});
      return;
    }
    let messageObj = await channelObj.messages.fetch(message_id);
    if (!messageObj){
      let embed = new MessageEmbed().setDescription("Сообщение не найдено!").setColor(colors.gray);
      message.reply({embeds: [embed]});
      return;
    }
    if (messageObj.embeds.length === 0){
      let embed = new MessageEmbed().setDescription("Изменять можно только embed сообщения!").setColor(colors.gray);
      message.reply({embeds: [embed]});
      return;
    }
    const file = message.attachments.first()?.url;
    if (!file){
      let embed = new MessageEmbed().setDescription("Добавте файл с конфигом embed!").setColor(colors.gray);
      message.reply({embeds: [embed]});
      return;
    }
    const response = await axios.get(file,  {
      responseType: 'arraybuffer',
      responseEncoding: 'binary'
    });
    if (response.status !== 200){
      let embed = new MessageEmbed().setDescription("Неудалось прочитать файл!").setColor(colors.gray);
      message.reply({embeds: [embed]});
      return;
    }
    let text = iconv.decode(Buffer.from(response.data), "utf-8");
    try{
      text = JSON.parse(text);
    }catch (e) {
      let embed = new MessageEmbed().setDescription("Конфиг embed должен быть в формате JSON!").setColor(colors.gray);
      message.reply({embeds: [embed]});
      return;
    }
    if (!text){
      let embed = new MessageEmbed().setDescription("Конфиг embed должен быть в формате JSON!").setColor(colors.gray);
      message.reply({embeds: [embed]});
      return;
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
      let replyEmbed = new MessageEmbed().setDescription("Успешно!").setColor(colors.green);
      message.reply({embeds: [replyEmbed]});
    }catch (e) {}
  }
}