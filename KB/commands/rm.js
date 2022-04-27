const {prefix} = require("../config.json");
const {checkRoles, checkChannels} = require("../utils/checkAvailability");
const dateParser = require("../utils/dateParser");
const {Reminds} = require("../main");
const {MessageEmbed} = require("discord.js");
let colors = require("../utils/colors");
module.exports = {
  name: "rm",
  description: "Напоминает о чём-то.",
  example: `${prefix}rm [time] [?reason]`,
  category: "utils",
  execute: async function(message, command, dbGuild, client){
    let messageArray = message.content.split(' ');
    let args = messageArray.slice(1);
    let guild = message.guild;
    let member = await guild.members.fetch(message.author.id);
    if (!await checkRoles(command, member)){
      message.reply("Вы не можете использовать эту команду!");
      return;
    };
    if (!await checkChannels(command, message.channel.id)){
      message.reply("Вы не можете использовать эту команду здесь!");
      return;
    }
    if (!args[0]){
      message.reply("Укажите время!");
      return;
    }
    if (!args[1]){
      message.reply("Введите сообщение для напоминания!");
      return;
    }
    let time;
    try {
      time = dateParser(args[0]);
    } catch (e) {
      message.reply("⛔ Неверный формат даты");
      return;
    }
    let remind = new Reminds({
      user_id: message.author.id,
      text: args.slice(1,).join(" "),
      sendDate: time + new Date().getTime()
    });

    await remind.save();
    message.reply("OK");
    setTimeout(async () => {
      let ch = await message.author.createDM();
      let embed = new MessageEmbed()
        .setTitle("Вы просили напомнить вам:")
        .setDescription(args.slice(1,).join(" "))
        .setColor(colors.green);
      await ch.send({embeds: [embed]});
      await remind.remove();
    }, time)
  }
}