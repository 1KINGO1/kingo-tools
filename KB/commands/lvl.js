const {prefix} = require('../config.json');
const calcLevelByXp = require("../utils/calcLevelByXp");
const {MessageEmbed, MessageAttachment} = require("discord.js");
const {checkRoles, checkChannels} = require("../utils/checkAvailability");
const Canvas = require("canvas");
const { registerFont, createCanvas } = require('canvas')
const getUserFromMention = require("../utils/getUserFromMention");
const colors = require("../utils/colors");
const path = require("path");

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
      let embed = new MessageEmbed().setDescription("Вы не можете использовать эту команду!").setColor(colors.grayRed);
      message.reply({embeds: [embed]}).catch(e => e);
      return;
    };
    if (!await checkChannels(command, message.channel.id)){
      let embed = new MessageEmbed().setDescription("Вы не можете использовать эту команду здесь!").setColor(colors.grayRed);
      message.reply({embeds: [embed]}).catch(e => e);
      return;
    }

    let id = message.author.id;
    let mentionedMember;
    if (message.content.split(" ").filter(a => a.trim())[1]){
      mentionedMember = await getUserFromMention(message.content.split(" ")[1], message.guild);
      if (!mentionedMember){
        mentionedMember = await message.guild.members.fetch(message.content.split(" ")[1]);
      }
      id = mentionedMember?.id;
    }

    let user = JSON.parse(JSON.stringify(guild.options.levelSystem.users.find(user => user.id === id) || ""));
    if (!user){
      let embed = new MessageEmbed().setDescription("Пользователь не найден!").setColor(colors.gray);
      message.reply({embeds: [embed]});
      return;
    }
    let statistic = calcLevelByXp(user.totalXP);

    //Image
    try{
      const canvas = Canvas.createCanvas(700, 240);
      const context = canvas.getContext('2d');

      await registerFont(path.join(path.dirname(__dirname), "fonts", "Manrope-Bold.ttf"), { family: 'Manrope Bold' })
      await registerFont(path.join(path.dirname(__dirname), "fonts", "Manrope-SemiBold.ttf"), { family: 'Manrope Medium' })


      //===================================================================
      function roundRect(context, x1, y1, x2, y2, radius) {
        radius = Math.min(radius, (x2 - x1) / 2, (y2 - y1) / 2); // избегаем артефактов, в случае если радиус скругления больше одной из сторон
        context.beginPath();
        context.moveTo(x1 + radius, y1);
        context.lineTo(x2 - radius, y1);
        context.arcTo(x2, y1, x2, y1 + radius, radius);
        context.lineTo(x2, y2 - radius);
        context.arcTo(x2, y2, x2 - radius, y2, radius);
        context.lineTo(x1 + radius, y2);
        context.arcTo(x1, y2, x1, y2 - radius, radius);
        context.lineTo(x1, y1 + radius);
        context.arcTo(x1, y1, x1 + radius, y1, radius);
      }

      context.beginPath();
      roundRect(context, 0, 0, 700, 240, 30);
      context.closePath();
      context.clip();
      try{
        const background = await Canvas.loadImage(user.backgroundImage || "https://media.discordapp.net/attachments/959916309041283152/970402237488726056/unknown.png?width=700&height=240");
        context.drawImage(background, 0, 0, canvas.width, canvas.height);
      }catch (e) {
        const background = await Canvas.loadImage(user.backgroundImage);
        context.drawImage(background, 0, 0, canvas.width, canvas.height);
      }

      // Контейнер Контента
      context.beginPath();
      roundRect(context, 10, 10, 700 - 10, 240 - 10, 22);
      context.fillStyle = "rgba(0, 0, 0, 0.35)";
      context.filter = "blur(100px)";
      context.closePath();
      context.fill();

      //Ник
      context.font = '500 42px "Manrope Bold"';
      context.fillStyle = user.secondThemeColor || "#fff";
      context.fillText(mentionedMember?.displayName || member.displayName, 235, 85);

      //Разделитель
      let widthName = context.measureText(`${mentionedMember?.displayName || member.displayName}`).width;
      context.beginPath();
      roundRect(context, 235, 92, 235 + widthName, 97, 10);
      context.closePath();
      context.fillStyle = "#fff";
      context.fill();

      //Ранг
      context.font = '30px "Manrope Medium"';
      let rank;
      let users = JSON.parse(JSON.stringify(guild.options.levelSystem.users));
      for (let userIndex in users){
        if (users[userIndex].id === (mentionedMember || member).id){
          rank = userIndex;
        }
      }
      let widthRank = context.measureText(`Rank №${+rank + 1}`).width;
      context.fillStyle = "#fff";
      context.fillText(`Rank №${+rank + 1}`, canvas.width - widthRank - 25, 85);

      //Прогресс
      context.font = '25px "Manrope Medium"';
      let width = context.measureText(`${m(statistic.levelFarmed, 1).trim()}/${m(statistic.levelNeedFarm, 1).trim()}`).width;
      context.fillStyle = "#fff";
      context.fillText(`${m(statistic.levelFarmed, 1).trim()}/${m(statistic.levelNeedFarm, 1).trim()}`, canvas.width - width - 25, 150);

      //Проценты
      context.font = '25px "Manrope Medium"';
      let widthPercents = context.measureText(`${Math.round((statistic.levelFarmed / statistic.levelNeedFarm) * 100)}%`).width;
      context.fillStyle = "#fff";
      context.fillText(`${Math.round((statistic.levelFarmed / statistic.levelNeedFarm) * 100)}%`, canvas.width - widthPercents - 20, 180 + 5);

      //Линия прогресса (Задний фон)
      context.beginPath();
      roundRect(context, 235, 160 + 5, canvas.width - widthPercents - 20 - 10, 182 + 5, 8);
      context.closePath();
      context.lineWidth = 3;
      context.strokeStyle = "#fff";
      context.lineCap = 'round';
      context.stroke();

      //Уровень
      context.font = '30px "Manrope Medium"';
      context.fillStyle = "#fff";
      context.fillText(`level ${statistic.level}`, 235, 150);

      //Линия прогресса
      context.beginPath();
      roundRect(context, 239, 164 + 5, 244 + Math.round((canvas.width - widthPercents - 244) * statistic.levelFarmed / statistic.levelNeedFarm), 178 + 5, 6);
      context.closePath();
      context.fillStyle = user.themeColor || "#fff";
      context.fill();

      //Аватар
      let avatarX = 120;
      let avatarY = 120;
      context.beginPath();
      context.arc(avatarX, avatarY, 90, 0, Math.PI * 2, true);
      context.closePath();
      context.clip();
      const avatar = await Canvas.loadImage(`https://cdn.discordapp.com/avatars/${mentionedMember?.id || message.author.id}/${mentionedMember?.user?.avatar || message.author.avatar}.png`);
      context.drawImage(avatar, avatarX - 90, avatarY - 90, 180, 180);

      //Обводка аватара
      context.strokeStyle = user.themeColor || '#8c8c8c';
      context.lineWidth = 10;
      context.beginPath();
      context.arc(avatarX, avatarY, 90, 0, Math.PI * 2, true);
      context.stroke();

      const attachment = new MessageAttachment(canvas.toBuffer(), 'profile-image.png');
      message.reply({files: [attachment]})
    }catch (e) {console.log(e)}
  }
}