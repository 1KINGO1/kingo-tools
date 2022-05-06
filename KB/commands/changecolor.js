const {prefix} = require("../config.json");
const {checkRoles, checkChannels} = require("../utils/checkAvailability");
const {MessageEmbed} = require("discord.js");
const colors = require("../utils/colors");
module.exports = {
  name: "changecolor",
  description: "Устанавливает цвет",
  example: `${prefix}changecolor [main | second] [hex color]`,
  category: "levels",
  execute: async function(message, command, guild) {

    if (!guild.options.levelSystem.on) return;

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

    let user = JSON.parse(JSON.stringify(guild.options.levelSystem.users.find(user => user.id === message.author.id) || ""));
    if (!user) {
      let embed = new MessageEmbed().setDescription("Пользователь не найден!").setColor(colors.gray);
      message.reply({embeds: [embed]}).catch(e => e);
      return;
    }

    if (message.content.split(" ")[1] !== "main" && message.content.split(" ")[1] !== "second"){
      let embed = new MessageEmbed().setDescription(`⛔ Неверный формат команды, укажите верный тип (\`${this.example}\`)`).setColor(colors.grayRed);
      message.reply({embeds: [embed]}).catch(e => e);
      return;
    }
    if (!/#[0-9a-f]{3,6}/.test(message.content.split(" ")[2])){
      let embed = new MessageEmbed().setDescription(`⛔ Неверный формат команды, укажите hex color (\`${this.example}\`)`).setColor(colors.grayRed);
      message.reply({embeds: [embed]}).catch(e => e);
      return;
    }

    message.content.split(" ")[1] === "main" ? user.themeColor = message.content.split(" ")[2] : user.secondThemeColor = message.content.split(" ")[2]

    let resultArray = [];
    for (let usr of JSON.parse(JSON.stringify(guild.options.levelSystem.users))){
      if (usr.id === user.id){
        resultArray.push(user);
      }
      else{
        resultArray.push(usr);
      }
    }
    guild.options = {...guild.options, levelSystem: {...guild.options.levelSystem,  users: resultArray}};

    await guild.save();

    let embed = new MessageEmbed().setDescription(`✅ Цвет изменён.`).setColor(colors.green);
    message.reply({embeds: [embed]}).catch(e => e);
  }
}