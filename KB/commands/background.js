const {prefix} = require("../config.json");
const {checkRoles, checkChannels} = require("../utils/checkAvailability");
module.exports = {
  name: "background",
  description: "Устанавливает картинку на задний фон",
  example: `${prefix}background [image url]`,
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

    if (!message.content.split(" ")[1]){
      message.reply(`⛔ Неверный формат команды, укажите ссылку на картинку (\`${this.example}\`)`);
      return;
    }

    user.backgroundImage = message.content.split(" ")[1];

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

    message.reply("✅ фон изменён.");
    return;
  }
}