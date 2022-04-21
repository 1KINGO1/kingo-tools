const {MessageEmbed} = require("discord.js");
module.exports = [
  {
    name: "Таблетка \"Работяга\"",
    description: "Убирает кд с всех способов зароботка, кроме ферм (единоразово).",
    icon: "💊",
    type: "item",
    silverPrice: 0,
    goldPrice: 1,
    async onUse(guild, user, message){
      user.workCountdown = 0;
      user.boxCountdown = 0;
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
      let embed = new MessageEmbed()
        .setDescription(`Кд с всех способов зароботка сняты!`)
        .setColor("#378f00");
      message.reply({embeds: [embed]});
    }
  },
  {
    name: "Модный лук",
    description: "Добавляет 5ед. брони",
    icon: "👙",
    type: "item",
    silverPrice: 5000,
    goldPrice: 0,
    async onUse(guild, user, message){
      if (user.defence === 100){
        let embed = new MessageEmbed()
          .setDescription(`👹 Вы попытались надеть на себя слишком много брони, к сожалению, у вас не получилось (Максимально возможная броня - \`100ед\`)!`)
          .setColor("#eb4034");
        return message.reply({embeds: [embed]});
      }
      if (["ghost"].includes(user.selectedCharacter)){
        let embed = new MessageEmbed()
          .setDescription(`👹 По какой-то причине броня не налезла на привидение!`)
          .setColor("#eb4034");
        return message.reply({embeds: [embed]});
      }
      user.defence += 5;
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
      let embed = new MessageEmbed()
        .setDescription(`Добавлено 5ед брони к вашему персонажу!!`)
        .setColor("#378f00");
      message.reply({embeds: [embed]});
    }
  },
  {
    name: "Сарай",
    description: "Пассивный доход 50<:silver_coin:965239170459136041> в сутки",
    icon: "🛖",
    type: "farm",
    farmSilverEarn: 50,
    farmGoldEarn: 0,
    silverPrice: 20000,
    goldPrice: 0,
    async onUse(guild, user, message){}
  },
  {
    name: "Фабрика",
    description: "Пассивный доход 0.05<:gold_coin:965238193945444372> в сутки",
    icon: "🏭",
    type: "farm",
    farmSilverEarn: 0,
    farmGoldEarn: 0.05,
    silverPrice: 0,
    goldPrice: 10,
    async onUse(guild, user, message){}
  },
];