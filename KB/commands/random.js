const {prefix} = require("../config.json");
const {checkRoles, checkChannels} = require("../utils/checkAvailability");
const {MessageEmbed} = require("discord.js");
const colors = require("../utils/colors");
module.exports = {
  name: "random",
  description: "Выводит случайного пользователя из списка",
  example: `${prefix}random [mention[] or id[]]`,
  category: "fan",
  execute: async function(message, command){
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
    let args = message.content.split(" ").slice(1);

    if (args.length === 0){
      let embed = new MessageEmbed().setDescription("Введите список пользователей!").setColor(colors.grayRed);
      message.reply({embeds: [embed]}).catch(e => e);
      return;
    }

    if (args.length === 1) {
      if (/[0-9]+-[0-9]+/.test(args[0])) {
        let [num1, num2] = args[0].split("-");
        if (+num2 <= +num1) {
          let embed = new MessageEmbed().setDescription("Второе число не может быть больше или равнятся первому! ").setColor(colors.gray);
          message.reply({embeds: [embed]});
          return;
        }
        message.reply(Math.floor(Math.random() * (num2 - num1 + 1) + num1) + "").catch(e => e);
        return;
      } else {
        message.reply(args[0]).catch(e => e);
        return
      }
    }

    message.reply(args[Math.floor(Math.random() * (args.length - 1 - 0 + 1) + 0) + ""]).catch(e => e);

  }

}