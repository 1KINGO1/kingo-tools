const {prefix} = require("../config.json");
const {checkRoles, checkChannels} = require("../utils/checkAvailability");
module.exports = {
  name: "random",
  description: "Выводит случайного пользователя из списка",
  example: `${prefix}random [mention[] or id[]]`,
  category: "fan",
  execute: async function(message, command){
    let member = await message.guild.members.fetch(message.author.id);
    if (!await checkRoles(command, member)){
      message.reply("Вы не можете использовать эту команду!");
      return;
    };
    if (!await checkChannels(command, message.channel.id)){
      message.reply("Вы не можете использовать эту команду здесь!");
      return;
    }
    let args = message.content.split(" ").slice(1);

    if (args.length === 0){
      message.reply("Введите список пользователей !");
      return;
    }

    if (args.length === 1){
      if (/[0-9]+-[0-9]+/.test(args[0])){
        let [num1, num2] = args[0].split("-");
        if (+num2 <= +num1){
          message.reply("Второе число не может быть больше или равнятся первому! ")
          return;
        }
        message.reply(Math.floor(Math.random() * (num2 - num1 + 1) + num1) + "");
        return;
      }
      else{
        message.reply(args[0]);
        return
      }
    }

    message.reply(args[Math.floor(Math.random() * (args.length - 1 - 0 + 1) + 0) + ""]);
    return;

  }

}