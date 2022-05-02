const {prefix} = require("../config.json");
const {checkRoles, checkChannels} = require("../utils/checkAvailability");
const {MessageEmbed} = require("discord.js");
const colors = require("../utils/colors");
module.exports = {
  name: "enter",
  description: "Добавляет пользователя в систему экономики.",
  example: `${prefix}enter`,
  category: "economy",
  execute: async function(message, command, dbGuild){
    if (!dbGuild.options.economy.on) return;
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
    let user = JSON.parse(JSON.stringify(dbGuild.options.economy.users.find(user => user.id === message.author.id) || ""));
    if (user){
      let embed = new MessageEmbed()
        .setDescription("🕷 Вы уже находитесь в подземелье!")
        .setColor("#eb4034");
      message.reply({embeds: [embed]});
      return;
    }
    user = {
      id: message.author.id,
      goldCoins: 0,
      silverCoins: 0,
      isDied: false,
      diedFor: 0,
      workCountdown: 0,
      boxCountdown: 0,
      swordDamage: 1,
      farmLastCollect: 0,
      bowDamage: 0,
      magicDamage: 0,
      hp: 100,
      defence: 5,
      selectedCharacter: "noob",
      inventory: [],
    };

    dbGuild.options = {...dbGuild.options, economy: {...dbGuild.options.economy,  users: [...dbGuild.options.economy.users, user]}};
    await dbGuild.save();

    let embed = new MessageEmbed()
      .setDescription("🕸 Добро пожаловать в подземелье!")
      .setColor("#378f00");
    message.reply({embeds: [embed]});
  }
}