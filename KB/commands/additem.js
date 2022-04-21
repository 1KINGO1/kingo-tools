const {prefix} = require("../config.json");
const {checkRoles, checkChannels} = require("../utils/checkAvailability");
const axios = require("axios");
const items = require("../modules/economy/items");
let iconv = require('iconv-lite');
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
      message.reply("Вы не можете использовать данную команду!");
      return;
    }
    ;
    if (!await checkChannels(command, message.channel.id)) {
      message.reply("Вы не можете использовать эту команду здесь!");
      return;
    }

    const file = message.attachments.first()?.url;
    if (!file){
      return message.reply("Добавте файл с настройками предмета!");
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
      return message.reply("Настройки должны быть в формате JSON!");
    }

    if (!text){
      message.reply("Настройки должны быть в формате JSON!");
    }

    if (!(
      "name" in text &&
      "silverPrice" in text &&
      "goldPrice" in text &&
      "description" in text &&
      "text" in text &&
      "icon" in text
    )){
      return message.reply(`Объект должен содержать свойства: \n\`name\` - имя предмета \n\`description\` - краткое описание \n\`silverPrice\` - цена в серебряных монетках \n\`goldPrice\` - цена в золотых монетках \n\`text\` - текст, который будет появляться при использовании предмета \n\`icon\` - иконка предмета`);
    }

    if (!(
      typeof text.name === "string" &&
      typeof text.description === "string" &&
      typeof text.silverPrice === "number" &&
      typeof text.goldPrice === "number" &&
      typeof text.text === "string" &&
      typeof text.icon === "string"
    )){
      return message.reply(`Введены неверные типы для значений, вот правильные: \n\`name\` - Строка \n\`description\` - Строка \n\`silverPrice\` - Число \n\`goldPrice\` - Число \n\`text\` - Строка\n\`icon\` - Строка`);
    }

    if (text.silverPrice < 0 || text.goldPrice < 0){
      return message.reply("Цена не может быть меньше нуля!");
    }

    if (text.silverPrice === 0 && text.goldPrice === 0){
      return message.reply("Товар не может быть бесплатным!");
    }

    if (guild.options.economy.economyItems.find(item => item.name.toLowerCase() === text.name) || items.find(item => item.name.toLowerCase() === text.name)){
      return message.reply("Предмет с таким именем уже есть!");
    }
    guild.options = {...guild.options, economy: {...guild.options.economy, economyItems: [...guild.options.economy.economyItems, {name: text.name, description: text.description, silverPrice: text.silverPrice, goldPrice: text.goldPrice, text: text.text, type: "discord_item", icon: text.icon}]}};
    await guild.save();
    return message.reply("Добавлено.");
  }
}