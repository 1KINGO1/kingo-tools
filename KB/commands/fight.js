const {prefix} = require("../config.json");
const {checkRoles, checkChannels} = require("../utils/checkAvailability");
const {MessageEmbed, MessageActionRow, MessageButton} = require("discord.js");
const characters = require("../modules/economy/characters");
const getUserFromMention = require("../utils/getUserFromMention");
let colors = require("../utils/colors");

module.exports = {
  name: "fight",
  description: "Напасть на игрока.",
  example: `${prefix}fight [id или mention]`,
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
    let user1 = await message.guild.members.fetch(message.author.id);
    let user1DB = JSON.parse(JSON.stringify(guild.options.economy.users.find(user => user.id === message.author.id) || ""));
    if (!user1DB) {
      let embed = new MessageEmbed()
        .setDescription("👹 Вы не являетесь участником экономики.")
        .setColor("#eb4034");
      message.reply({embeds: [embed]});
      return;
    }
    if(user1DB.isDead){
      let embed = new MessageEmbed()
        .setDescription("👹 Вы мёртвы.")
        .setColor("#eb4034");
      message.reply({embeds: [embed]});
      return;
    }
    if (!args[0]){
      message.reply(`⛔ Неверный формат команды, упомяните или укажите айди пользователя (\`${this.example}\`)`);
      return;
    }
    let user2 = await getUserFromMention(args[0], message.guild);
    if (!user2){
      try{
        user2 = await message.guild.members.fetch(args[0]);
      }catch (e) {}
    }
    if (!user2){
      message.reply("Пользователь не найден.");
      return;
    }
    let user2DB = JSON.parse(JSON.stringify(guild.options.economy.users.find(user => user.id === user2.user.id) || ""));
    if (!user2DB) {
      let embed = new MessageEmbed()
        .setDescription("👹 Пользователь не найден.")
        .setColor("#eb4034");
      message.reply({embeds: [embed]});
      return;
    }
    if (user2DB.isDied){
      let embed = new MessageEmbed()
        .setDescription("👹 Пользователь мёртв.")
        .setColor("#eb4034");
      message.reply({embeds: [embed]});
      return;
    }

    const user1Stats = {
      hp: user1DB.hp,
      defence: user2DB.defence
    };
    const user2Stats = {
      hp: user2DB.hp,
      defence: user2DB.defence
    };

    let enemyEmbed = new MessageEmbed()
      .setColor(colors.orange)
      .setAuthor({name: `${user2.user.tag}`, iconURL: user2.user.displayAvatarURL({size:1024,dynamic:true})})
      .addField("Здоровье", user2DB.hp + "<:heart:968138260918448169>", true)
      .addField("Защита", user2DB.defence  + "🛡️", true);
    let profileEmbed = new MessageEmbed()
      .setColor(colors.green)
      .setAuthor({name: `${user1.user.tag}`, iconURL: user1.user.displayAvatarURL({size:1024,dynamic:true})})
      .addField("Здоровье", user1DB.hp  + "<:heart:968138260918448169>", true)
      .addField("Защита", user1DB.defence  + "🛡️", true);
    message.channel.send({embeds: [enemyEmbed, profileEmbed]});
  }
}