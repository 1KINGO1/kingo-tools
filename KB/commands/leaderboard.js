const {prefix} = require('../config.json');
const calcLevelByXp = require("../utils/calcLevelByXp");
const {MessageEmbed} = require("discord.js");
const {checkRoles, checkChannels} = require("../utils/checkAvailability");
const numberWithSpaces = require("../utils/numberWithSpaces");
const colors = require("../utils/colors");

module.exports = {
  name: "leaderboard",
  description: "Показывает топ игроков по уровню",
  example: `${prefix}leaderboard [?page]`,
  category: "levels",
  execute: async function(message, command, guild){

    if (!guild.options.levelSystem.on) return;

    let messageArray = message.content.split(" ");
    let member = await message.guild.members.fetch(message.author.id);
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

    let page = 0;

    if (messageArray[1] && +messageArray[1]){
      page = messageArray[1];
    }

    let usersArray = JSON.parse(JSON.stringify(guild.options.levelSystem.users)).sort((usr1, usr2)  => usr2.totalXP - usr1.totalXP);

    usersArray = usersArray.slice(page * 20, page * 20 + 20).map((usr, index) => `${index + 1}. <@${usr.id}> ${numberWithSpaces(usr.totalXP, ",")}xp lvl ${calcLevelByXp(usr.totalXP).level}`);

    if (usersArray.length === 0){
      try{
        const embed = new MessageEmbed()
          .setColor("#7f6ce5")
          .setTitle(`Leaderboard для ${message.guild.name}`)
          .setDescription(`Страница пуста`)
          .setFooter(`Страница ${page}/${Math.ceil(usersArray.length/20)}`)
        ;
        message.reply({embeds: [embed]}).catch((e) => {})
      }catch (e) {}
    }
    else{
      try{
        const embed = new MessageEmbed()
          .setColor("#7f6ce5")
          .setTitle(`Leaderboard для ${message.guild.name}`)
          .setDescription(usersArray.join(`\n`))
          .setFooter(`Страница ${page}/${Math.ceil(usersArray.length/20)}`)
        ;
        message.reply({embeds: [embed]}).catch((e) => {})
      }catch (e) {}
    }
  }
}