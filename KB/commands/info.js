const {prefix} = require("../config.json");
const {checkRoles, checkChannels} = require("../utils/checkAvailability");
const getUserFromMention = require("../utils/getUserFromMention");
const {MessageEmbed} = require("discord.js");
const calcLevelByXp = require("../utils/calcLevelByXp");
const characters = require("../modules/economy/characters");
const moment = require("moment");
const {SlashCommandBuilder} = require("@discordjs/builders");
const colors = require("../utils/colors");
moment.locale("ru");
module.exports = {
  name: "info",
  description: "Показывает информацию о пользователе.",
  useSlash: true,
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Показывает информацию о пользователе.")
    .addUserOption(option =>
      option
        .setName("target")
        .setRequired(false)
        .setDescription("Пользователь")),
  example: `${prefix}info [?mention or id]`,
  category: "utils",
  execute: async function(message, command, dbGuild){
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

    let user = member;

    if (args[0]){
      let mentionedUser = await getUserFromMention(args[0], guild);
      if (!mentionedUser){
        try{
          mentionedUser = await guild.members.fetch(args[0]);
        }catch (e) {}
      }
      if (!mentionedUser){
        let embed = new MessageEmbed().setDescription("Пользователь не найден!").setColor(colors.gray);
        message.reply({embeds: [embed]});
        return;
      }
      else{
        user = mentionedUser;
      }
    }

    const embed = new MessageEmbed()
      .setColor(user.roles?.highest?.hexColor || "#7f6ce5")
      .setAuthor({name: `${user.displayName} ( ${user.user.tag} )`, iconURL: user.user.displayAvatarURL({size:1024,dynamic:true})})
      .setFooter({text: `ID: ${user.user.id}`})
      .setThumbnail(user.user.displayAvatarURL({size:1024,dynamic:true}));
    embed.addField("Роли", user.roles.cache.filter(role => role.name !== "@everyone").map(role => `<@&${role.id}>`).join(" ") || "Нет ролей :(");
    embed.addField("Аккаунт создан:", moment(user.user.createdAt).locale("ru").format('LLLL'));
    embed.addField("Зашел на сервер:", moment(user.joinedAt).locale("ru").format('LLLL'));

    let dbUser = JSON.parse(JSON.stringify(dbGuild.options.levelSystem.users.find(usr => usr.id === user.user.id) || ""));
    if (dbGuild.options.levelSystem.on && dbUser){
      embed.addField("Уровни:", `Уровень: \`${calcLevelByXp(dbUser.totalXP).level}\`\nXP: \`${dbUser.totalXP}\`\nПрогресс: \`${calcLevelByXp(dbUser.totalXP).levelFarmed}/${calcLevelByXp(dbUser.totalXP).levelNeedFarm}\``);
    }
    let economyUser = JSON.parse(JSON.stringify(dbGuild.options.economy.users.find(usr => usr.id === user.user.id) || ""));
    if (dbGuild.options.economy.on && economyUser){

      let character = characters.find(character => character.name === economyUser.selectedCharacter);

      embed.addField("Экономика:",
        `Баланс: ${economyUser.goldCoins}<:gold_coin:965238193945444372> ${economyUser.silverCoins}<:silver_coin:965239170459136041>
        Персонаж: \`${character?.name}\` ${character?.icon}
        Урон: \`${economyUser.swordDamage + " | " + economyUser.bowDamage + " | " + economyUser.magicDamage}\`
        Здоровье: \`${economyUser.hp}\`
        Броня: \`${economyUser.defence}\`
        Размер инвентаря: \`${economyUser.inventory.length}\``);
    }

    await message.reply({embeds: [embed]}).catch(e => {})
  },
  executeLikeSlash: async function (interaction, command, dbGuild) {
    if (!await checkRoles(command, interaction.member)) {
      return interaction.reply({content: "Вы не можете использовать эту команду!", ephemeral: true});
    }
    if (!await checkChannels(command, interaction.channel.id)) {
      return interaction.reply({content: "Вы не можете использовать эту команду здесь!", ephemeral: true});
    }
    let user;
    try {
      user = await interaction.guild.members.fetch(interaction.options.getUser('target')?.id || "0");
    } catch (e) {}
    if (!user) {
      user = interaction.member;
    }
    const embed = new MessageEmbed()
      .setColor(user.roles?.highest?.hexColor || "#7f6ce5")
      .setAuthor({
        name: `${user.displayName} ( ${user.user.tag} )`,
        iconURL: user.user.displayAvatarURL({size: 1024, dynamic: true})
      })
      .setFooter({text: `ID: ${user.user.id}`})
      .setThumbnail(user.user.displayAvatarURL({size: 1024, dynamic: true}));
    embed.addField("Роли", user.roles.cache.filter(role => role.name !== "@everyone").map(role => `<@&${role.id}>`).join(" ") || "Нет ролей :(");
    embed.addField("Аккаунт создан:", moment(user.user.createdAt).locale("ru").format('LLLL'));
    embed.addField("Зашел на сервер:", moment(user.joinedAt).locale("ru").format('LLLL'));

    let dbUser = JSON.parse(JSON.stringify(dbGuild.options.levelSystem.users.find(usr => usr.id === user.user.id) || ""));
    if (dbGuild.options.levelSystem.on && dbUser) {
      embed.addField("Уровни:", `Уровень: \`${calcLevelByXp(dbUser.totalXP).level}\`\nXP: \`${dbUser.totalXP}\`\nПрогресс: \`${calcLevelByXp(dbUser.totalXP).levelFarmed}/${calcLevelByXp(dbUser.totalXP).levelNeedFarm}\``);
    }
    let economyUser = JSON.parse(JSON.stringify(dbGuild.options.economy.users.find(usr => usr.id === user.user.id) || ""));
    if (dbGuild.options.economy.on && economyUser) {

      let character = characters.find(character => character.name === economyUser.selectedCharacter);

      embed.addField("Экономика:",
        `Баланс: ${economyUser.goldCoins}<:gold_coin:965238193945444372> ${economyUser.silverCoins}<:silver_coin:965239170459136041>
        Персонаж: \`${character?.name}\` ${character?.icon}
        Урон: \`${economyUser.swordDamage + " | " + economyUser.bowDamage + " | " + economyUser.magicDamage}\`
        Здоровье: \`${economyUser.hp}\`
        Броня: \`${economyUser.defence}\`
        Размер инвентаря: \`${economyUser.inventory.length}\``);
    }
    await interaction.reply({embeds: [embed], ephemeral: false})
  }
}