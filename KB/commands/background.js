const {prefix} = require("../config.json");
const {checkRoles, checkChannels} = require("../utils/checkAvailability");
const {MessageEmbed} = require("discord.js");
const colors = require("../utils/colors");
module.exports = {
  name: "background",
  description: "Устанавливает картинку на задний фон",
  example: `${prefix}background [image url]`,
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

    if (!message.content.split(" ").filter(a => a.trim())[1]){
      let embed = new MessageEmbed().setDescription(`⛔ Неверный формат команды, укажите ссылку на картинку (\`${this.example}\`)`).setColor(colors.grayRed);
      message.reply({embeds: [embed]}).catch(e => e);
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

    let embed = new MessageEmbed().setDescription(`Фон изменён!`).setColor(colors.green);
    message.reply({embeds: [embed]}).catch(e => e);
  }
}