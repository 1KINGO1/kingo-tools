const {prefix} = require("../config.json");
const {checkRoles, checkChannels} = require("../utils/checkAvailability");
module.exports = {
  name: "changecolor",
  description: "Устанавливает цвет",
  example: `${prefix}changecolor [main | second] [hex color]`,
  category: "levels",
  execute: async function(message, command, guild) {

    if (!guild.options.levelSystem.on) return;

    let member = await message.guild.members.fetch(message.author.id);
    if (!await checkRoles(command, member)) {
      message.reply("Вы не можете использовать эту команду!");
      return;
    }
    ;
    if (!await checkChannels(command, message.channel.id)) {
      message.reply("Вы не можете использовать эту команду здесь!");
      return;
    }

    let user = JSON.parse(JSON.stringify(guild.options.levelSystem.users.find(user => user.id === message.author.id) || ""));
    if (!user) {
      message.reply("Пользователь не найден!");
      return;
    }

    if (message.content.split(" ")[1] !== "main" && message.content.split(" ")[1] !== "second"){
      message.reply(`⛔ Неверный формат команды, укажите верный тип (\`${this.example}\`)`);
      return;
    }
    if (!/#[0-9a-f]{3,6}/.test(message.content.split(" ")[2])){
      message.reply(`⛔ Неверный формат команды, укажите hex color (\`${this.example}\`)`);
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

    message.reply("✅ Цвет изменён.");
    return;
  }
}