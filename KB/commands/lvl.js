const {prefix} = require('../config.json');
const calcLevelByXp = require("../utils/calcLevelByXp");
const {MessageEmbed, MessageAttachment} = require("discord.js");
const {checkRoles, checkChannels} = require("../utils/checkAvailability");
const Canvas = require("canvas");
const getUserFromMention = require("../utils/getUserFromMention");

function m(n,d){
  let x = (''+n).length;
  let p = Math.pow;
  d = p(10,d);
  x -= x%3
  return Math.round(n*d/p(10,x))/d+" KMGTPE"[x/3]
}

module.exports = {
  name: "lvl",
  description: "Показывает текущий уровень и прогресс",
  example: `${prefix}lvl`,
  category: "levels",
  execute: async function(message, command, guild){

    if (!guild.options.levelSystem.on) return;

    let member = await message.guild.members.fetch(message.author.id);
    if (!await checkRoles(command, member)){
      message.reply("Вы не можете использовать эту команду!");
      return;
    };
    if (!await checkChannels(command, message.channel.id)){
      message.reply("Вы не можете использовать эту команду здесь!");
      return;
    }

    let id = message.author.id;
    let mentionedMember;
    if (message.content.split(" ")[1]){
      mentionedMember = await getUserFromMention(message.content.split(" ")[1], message.guild);
      if (!mentionedMember){
        mentionedMember = await message.guild.members.fetch(message.content.split(" ")[1]);
      }
      id = mentionedMember?.id;
    }

    let user = JSON.parse(JSON.stringify(guild.options.levelSystem.users.find(user => user.id === id) || ""));
    if (!user){
      message.reply("Пользователь не найден!");
      return;
    }
    let statistic = calcLevelByXp(user.totalXP);
    // try{
    //   const embed = new MessageEmbed()
    //     .setColor("#7f6ce5")
    //     .setTitle(`Статистика пользователя ${message.author.tag}`)
    //     .setDescription(`XP: ${user.totalXP}\nLevel: ${statistic.level}\nLevel Progress: ${statistic.levelFarmed}/${statistic.levelNeedFarm}`);
    //   message.reply({embeds: [embed]}).catch((e) => {})
    // }catch (e) {}

    //Image
    try{
      const canvas = Canvas.createCanvas(700, 240);
      const context = canvas.getContext('2d');

      try{
        const background = await Canvas.loadImage(user.backgroundImage || "https://media.discordapp.net/attachments/959916309041283152/964451211728285696/profile_background.png");
        context.drawImage(background, 0, 0, canvas.width, canvas.height);
      }catch (e) {
        const background = await Canvas.loadImage(user.backgroundImage);
        context.drawImage(background, 0, 0, canvas.width, canvas.height);
      }


      //Ник
      context.font = '48px sans-serif';
      context.fillStyle = user.themeColor || "#fff";
      context.fillText(mentionedMember?.displayName || member.displayName, 215, 80);

      //Ранг
      context.font = '40px sans-serif';

      //Уровень
      context.font = '30px sans-serif';
      context.fillStyle = user.themeColor || "#fff";
      context.fillText(`level ${statistic.level}`, 215, 150);

      //Прогресс
      context.font = '25px sans-serif';
      let width = context.measureText(`${m(statistic.levelFarmed, 1).trim()}/${m(statistic.levelNeedFarm, 1).trim()}`).width;
      context.fillStyle = user.themeColor || "#fff";
      context.fillText(`${m(statistic.levelFarmed, 1).trim()}/${m(statistic.levelNeedFarm, 1).trim()}`, canvas.width - width - 25, 150);

      //Линия прогресса (Задний фон)
      context.beginPath();
      context.moveTo(220, 180);
      context.lineWidth = 15;
      context.strokeStyle = user.secondThemeColor || '#8c8c8c';
      context.lineCap = 'round';
      context.lineTo(670, 180);
      context.stroke();

      //Линия прогресса
      context.beginPath();
      context.moveTo(220, 180);
      context.lineWidth = 15;
      context.strokeStyle = user.themeColor || "#fff";
      context.lineCap = 'round';
      context.lineTo(210 + statistic.levelFarmed / statistic.levelNeedFarm * 460, 180);
      context.stroke();

      //разделитель
      context.strokeStyle = user.themeColor || '#fff';
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(215, 100);
      context.lineTo(675, 100);
      context.stroke();

      //Avatar
      context.beginPath();
      context.arc(110, 120, 90, 0, Math.PI * 2, true);
      context.closePath();
      context.clip();
      const avatar = await Canvas.loadImage(`https://cdn.discordapp.com/avatars/${mentionedMember?.id || message.author.id}/${mentionedMember?.user?.avatar || message.author.avatar}.png`);
      context.drawImage(avatar, 20, 40, 180, 180);

      //Обводка
      context.strokeStyle = user.secondThemeColor || '#8c8c8c';
      context.lineWidth = 10;
      context.beginPath();
      context.arc(110, 120, 90, 0, Math.PI * 2, true);
      context.stroke();

      const attachment = new MessageAttachment(canvas.toBuffer(), 'profile-image.png');
      message.reply({files: [attachment]})
    }catch (e) {console.log(e)}
  }
}