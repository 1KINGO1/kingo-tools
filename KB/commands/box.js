const {prefix} = require("../config.json");
const {checkRoles, checkChannels} = require("../utils/checkAvailability");
const {MessageEmbed, MessageActionRow, MessageButton} = require("discord.js");
const colors = require("../utils/colors");
module.exports = {
  name: "box",
  description: "Позволяет заработать серебряные монетки на открытии коробок.",
  example: `${prefix}box`,
  category: "economy",
  execute: async function (message, command, guild) {
    if (!guild.options.economy.on) return;
    let messageArray = message.content.split(' ');
    let args = messageArray.slice(1);
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
    let user = JSON.parse(JSON.stringify(guild.options.economy.users.find(user => user.id === message.author.id) || ""));
    if (!user) {
      let embed = new MessageEmbed()
        .setDescription("👹 Вы не являетесь участником экономики.")
        .setColor("#eb4034");
      message.reply({embeds: [embed]});
      return;
    }
    if (user.boxCountdown > new Date().getTime()){
      let embed = new MessageEmbed()
        .setDescription(`👹 Вы сможете играть снова <t:${Math.floor(user.boxCountdown/1000)}:R>.`)
        .setColor("#eb4034");
      await message.reply({embeds: [embed]});
      return;
    }
    if (!args[0] || +args < 100){
      let embed = new MessageEmbed()
        .setDescription("👹 Нужно указать количество серебряных монет >= 100.")
        .setColor("#eb4034");
      message.reply({embeds: [embed]});
      return;
    }
    if (user.silverCoins < +args[0]){
      let embed = new MessageEmbed()
        .setDescription("👹 Недостаточно средств.")
        .setColor("#eb4034");
      message.reply({embeds: [embed]});
      return;
    }
    user.boxCountdown  = new Date().getTime() + 1000 * 60 * 10;
    let resultArray = [];
    for (let usr of JSON.parse(JSON.stringify(guild.options.economy.users || []))) {
      if (usr.id === user.id) {
        resultArray.push(user);
      } else {
        resultArray.push(usr);
      }
    }
    guild.options = {...guild.options, economy: {...guild.options.economy, users: resultArray}};
    await guild.save();

    let rewardArray = new Array(3).fill(null);
    rewardArray[Math.floor(Math.random() * 3)] = Math.floor(Math.random() * (+args[0]*3 - +args[0]*1.5 + 1) + +args[0]*1.5);
    rewardArray = rewardArray.map(item => !item ? Math.floor(Math.random() * (+args[0]*0.5 - 0 + 1) + 0) : item);

    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId("0")
          .setLabel("1️⃣")
          .setStyle("PRIMARY"),
        new MessageButton()
          .setCustomId("1")
          .setLabel("2️⃣")
          .setStyle("PRIMARY"),
        new MessageButton()
          .setCustomId("2")
          .setLabel("3️⃣")
          .setStyle("PRIMARY"),
      );
    let embed = new MessageEmbed()
      .setTitle("Выберете коробку.")
      .setDescription(`⠀⠀📦⠀⠀📦⠀⠀📦\n⠀⠀1⃣⠀⠀2⃣⠀⠀3⃣`)
      .setColor("#378f00");
    let boxMessage = await message.reply({embeds: [embed], components: [row]});
    const filter = (i) => {
      i.deferUpdate();
      return i.user.id === message.author.id;
    }
    boxMessage.awaitMessageComponent({filter, componentType: 'BUTTON', time: 60000 })
      .then(async interaction => {
        embed.setTitle("Поздравляем!")
        embed.setDescription(`Ваш выиграш: ${rewardArray[interaction.customId]}<:silver_coin:965239170459136041>`);
        await boxMessage.edit({embeds: [embed], components: []})
        user.silverCoins += +rewardArray[interaction.customId] - +args[0];
        user.workCountdown  = user.workCountdown;
        let resultArray = [];
        for (let usr of JSON.parse(JSON.stringify(guild.options.economy.users || []))) {
          if (usr.id === user.id) {
            resultArray.push(user);
          } else {
            resultArray.push(usr);
          }
        }
        guild.options = {...guild.options, economy: {...guild.options.economy, users: resultArray}};
        guild.markModified("options");
        await guild.save();
      })
      .catch(async err => {
        let embed = new MessageEmbed()
          .setDescription("👹 Вы не указали коробку, средства не будут списаны.")
          .setColor("#eb4034");
        message.reply({embeds: [embed]});
      });
  }
}