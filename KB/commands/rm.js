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
      let embed = new MessageEmbed().setDescription("Вы не можете использовать эту команду!").setColor(colors.grayRed);
      message.reply({embeds: [embed]});
      return;
    }
    if (!await checkChannels(command, message.channel.id)){
      let embed = new MessageEmbed().setDescription("Вы не можете использовать эту команду здесь!").setColor(colors.grayRed);
      message.reply({embeds: [embed]});
      return;
    }
    if (!args[0]){
      let embed = new MessageEmbed().setDescription(`Укажите время! (Пример:  1h30m)`).setColor(colors.grayRed);
      message.reply({embeds: [embed]});
      return;
    }
    if (!args[1]){
      let embed = new MessageEmbed().setDescription("Введите сообщение для напоминания!").setColor(colors.grayRed);
      message.reply({embeds: [embed]});
      return;
    }
    let time;
    try {
      time = dateParser(args[0]);
    } catch (e) {
      let embed = new MessageEmbed().setDescription("⛔ Неверный формат даты").setColor(colors.grayRed);
      message.reply({embeds: [embed]});
      return;
    }
    let remind = new Reminds({
      user_id: message.author.id,
      text: args.slice(1,).join(" "),
      sendDate: time + new Date().getTime()
    });

    await remind.save();
    let embed = new MessageEmbed().setDescription("Ок").setColor(colors.green);
    message.reply({embeds: [embed]});
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