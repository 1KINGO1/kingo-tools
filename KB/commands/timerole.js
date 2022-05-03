const {prefix} = require("../config.json");
const {checkRoles, checkChannels} = require("../utils/checkAvailability");
const dateParser = require("../utils/dateParser");
const {Reminds, Guild} = require("../main");
const {MessageEmbed} = require("discord.js");
let colors = require("../utils/colors");
const getUserFromMention = require("../utils/getUserFromMention");
module.exports = {
  name: "timerole",
  description: "Даёт роль на время.",
  example: `${prefix}timerole [user] [role id] [time]`,
  alternative: ["tr"],
  category: "utils",
  execute: async function (message, command, dbGuild, client) {
    let messageArray = message.content.split(' ');
    let args = messageArray.slice(1);
    let guild = message.guild;
    let member = await guild.members.fetch(message.author.id);
    if (!await checkRoles(command, member)) {
      let embed = new MessageEmbed().setDescription("Вы не можете использовать эту команду!").setColor(colors.grayRed);
      message.reply({embeds: [embed]});
      return;
    }
    if (!await checkChannels(command, message.channel.id)) {
      let embed = new MessageEmbed().setDescription("Вы не можете использовать эту команду здесь!").setColor(colors.grayRed);
      message.reply({embeds: [embed]});
      return;
    }
    if (!args[0] || !args[1] || !args[2]) {
      let embed = new MessageEmbed().setDescription(`Неверный формат команды! (\`${this.example}\`)`).setColor(colors.grayRed);
      message.reply({embeds: [embed]});
      return;
    }

    let banMember = await getUserFromMention(args[0], guild);
    if (!banMember){
      try{
        banMember = await message.guild.members.fetch(args[0]);
      }catch (e) {}
    }

    if (!banMember){
      let embed = new MessageEmbed().setDescription("⛔ Пользователь не найден!").setColor(colors.gray);
      message.reply({embeds: [embed]});
      return;
    }
    let role = message.guild.roles.cache.find(r => r.id === args[1]);
    if (!role){
      let embed = new MessageEmbed().setDescription("⛔ Роль не найдена!").setColor(colors.gray);
      message.reply({embeds: [embed]});
      return;
    }

    let timeRole = await dbGuild.options.timeRoles.find(r => r.roleId === args[1] && r.id === message.author.id);
    if (timeRole){
      let embed = new MessageEmbed().setDescription("⛔ У пользователя уже есть эта роль!").setColor(colors.gray);
      message.reply({embeds: [embed]});
      return;
    }

    let time;
    try {
      time = dateParser(args[2]);
    } catch (e) {
      let embed = new MessageEmbed().setDescription("⛔ Неверный формат даты").setColor(colors.grayRed);
      message.reply({embeds: [embed]});
      return;
    }
    try{
      await banMember.roles.add(role);
    }catch (e) {
      let embed = new MessageEmbed().setDescription("⛔ Не получилось дать пользователю роль!").setColor(colors.gray);
      message.reply({embeds: [embed]});
      return;
    }

    dbGuild.options = {...dbGuild.options, timeRoles: [...dbGuild.options.timeRoles, {roleId: args[1], id: message.author.id, to: new Date().getTime() + time}]};
    dbGuild.markModified("options");
    await dbGuild.save();
    let embed = new MessageEmbed().setDescription("Успешно!").setColor(colors.green);
    message.reply({embeds: [embed]});

    setTimeout(async () => {
      try{
        await banMember.roles.remove(role.id);
      }catch (e){}
      let resultArr = [];
      for (let trole of JSON.parse(JSON.stringify(dbGuild.options.timeRoles))){
        if (trole.roleId === role.id) continue;
        resultArr.push(trole);
      }
      dbGuild.options = {...dbGuild.options, timeRoles: resultArr};
      dbGuild.markModified("options");
      await dbGuild.save();
    }, time)
  }
}