const {prefix} = require("../config.json");
const {checkRoles, checkChannels} = require("../utils/checkAvailability");
const axios = require("axios");
const items = require("../modules/economy/items");
let iconv = require('iconv-lite');
const {MessageEmbed} = require("discord.js");
const colors = require("../utils/colors");
module.exports = {
  name: "additem",
  description: "Добавляет кастомный предмет в магазин.",
  example: `${prefix}additem [.txt file attachment]`,
  category: "economy",
  execute: async function (message, command, guild) {
    if (!guild.options.economy.on) return;
    let messageArray = message.content.split(' ');
    let args = messageArray.slice(1);
    let member = await message.guild.members.fetch(message.author.id);
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

    const file = message.attachments.first()?.url;
    if (!file){
      let embed = new MessageEmbed().setDescription("Добавьте файл с настройками предмета!").setColor(colors.grayRed);
      message.reply({embeds: [embed]}).catch(e => e);
      return;
    }
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
      let embed = new MessageEmbed().setDescription("Настройки должны быть в формате JSON!").setColor(colors.gray);
      message.reply({embeds: [embed]}).catch(e => e);
      return;
    }

    if (!text){
      let embed = new MessageEmbed().setDescription("Настройки должны быть в формате JSON!").setColor(colors.gray);
      message.reply({embeds: [embed]}).catch(e => e);
      return;
    }

    if (!(
      "name" in text &&
      "silverPrice" in text &&
      "goldPrice" in text &&
      "description" in text &&
      "text" in text &&
      "icon" in text
    )){
      let embed = new MessageEmbed().setDescription(`Объект должен содержать свойства: \n\`name\` - имя предмета \n\`description\` - краткое описание \n\`silverPrice\` - цена в серебряных монетках \n\`goldPrice\` - цена в золотых монетках \n\`text\` - текст, который будет появляться при использовании предмета \n\`icon\` - иконка предмета`).setColor(colors.gray);
      message.reply({embeds: [embed]}).catch(e => e);
      return
    }

    if (!(
      typeof text.name === "string" &&
      typeof text.description === "string" &&
      typeof text.silverPrice === "number" &&
      typeof text.goldPrice === "number" &&
      typeof text.text === "string" &&
      typeof text.icon === "string"
    )){
      let embed = new MessageEmbed().setDescription(`Введены неверные типы для значений, вот правильные: \n\`name\` - Строка \n\`description\` - Строка \n\`silverPrice\` - Число \n\`goldPrice\` - Число \n\`text\` - Строка\n\`icon\` - Строка`).setColor(colors.gray);
      message.reply({embeds: [embed]}).catch(e => e);
      return
    }

    if (text.silverPrice < 0 || text.goldPrice < 0){
      let embed = new MessageEmbed().setDescription("Цена не может быть меньше нуля!").setColor(colors.gray);
      message.reply({embeds: [embed]}).catch(e => e);
      return;
    }

    if (text.silverPrice === 0 && text.goldPrice === 0){
      let embed = new MessageEmbed().setDescription("Товар не может быть бесплатным!").setColor(colors.gray);
      message.reply({embeds: [embed]}).catch(e => e);
      return;
    }

    if (guild.options.economy.economyItems.find(item => item.name.toLowerCase() === text.name) || items.find(item => item.name.toLowerCase() === text.name)){
      let embed = new MessageEmbed().setDescription("Предмет с таким именем уже есть!").setColor(colors.gray);
      message.reply({embeds: [embed]}).catch(e => e);
      return;
    }
    guild.options = {...guild.options, economy: {...guild.options.economy, economyItems: [...guild.options.economy.economyItems, {name: text.name, description: text.description, silverPrice: text.silverPrice, goldPrice: text.goldPrice, text: text.text, type: "discord_item", icon: text.icon}]}};
    await guild.save();
    let embed = new MessageEmbed().setDescription("Добавлено!").setColor(colors.green);
    message.reply({embeds: [embed]}).catch(e => e);
    return;
  }
}