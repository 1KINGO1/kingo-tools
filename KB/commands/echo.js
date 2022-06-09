const {prefix} = require("../config.json");
const {checkRoles, checkChannels} = require("../utils/checkAvailability");
const axios = require("axios");
const iconv = require("iconv-lite");
const {MessageEmbed} = require("discord.js");
const colors = require("../utils/colors");
module.exports = {
  name: "echo",
  description: "Отправляет сообщение от  имени бота в текущий канал",
  example: `${prefix}echo [.txt file | message]`,
  category: "utils",
  execute: async function(message, command, guild, client) {
    let messageArray = message.content.split(' ').filter(a => a.trim());
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
    const file = message.attachments.first()?.url;
    if (!file && !args[0]){
      let embed = new MessageEmbed().setDescription("Добавте файл с конфигом сообщения или введите контент сообщения!").setColor(colors.grayRed);
      message.reply({embeds: [embed]}).catch(e => e);
      return
    }
    if (file){
      const response = await axios.get(file,  {
        responseType: 'arraybuffer',
        responseEncoding: 'binary'
      });
      if (response.status !== 200){
        let embed = new MessageEmbed().setDescription("Неудалось прочитать файл!").setColor(colors.gray);
        message.reply({embeds: [embed]}).catch(e => e);
        return;
      }
      let text = iconv.decode(Buffer.from(response.data), "utf-8");
      try{
        text = JSON.parse(text);
      }catch (e) {
        let embed = new MessageEmbed().setDescription("Конфиг сообщения должен быть в формате JSON!").setColor(colors.gray);
        message.reply({embeds: [embed]}).catch(e => e);
        return;
      }
      if (!text){
        let embed = new MessageEmbed().setDescription("Конфиг сообщения должен быть в формате JSON!").setColor(colors.gray);
        message.reply({embeds: [embed]}).catch(e => e);
        return;
      }
      try{
        await message.channel.send(text).catch(e => e);
      }catch (e) {}
    }
    else{
      try{
        message.channel.send({content: args.join(" ")})
      }catch (e) {}
    }
    await message.delete();
  }
}