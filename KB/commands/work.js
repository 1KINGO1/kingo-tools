const {prefix} = require("../config.json");
const {checkRoles, checkChannels} = require("../utils/checkAvailability");
const {MessageEmbed} = require("discord.js");
const characters = require("../modules/economy/characters");
// const addSilverCoins = require("../utils/addSilverCoins");

module.exports = {
  name: "work",
  description: "Позволяет заработать серебряные монетки.",
  example: `${prefix}work`,
  category: "economy",
  execute: async function (message, command, guild) {
    if (!guild.options.economy.on) return;
    let messageArray = message.content.split(' ');
    let args = messageArray.slice(1);
    let member = await message.guild.members.fetch(message.author.id);
    if (!await checkRoles(command, member)) {
      message.reply("Вы не можете использовать данную команду!");
      return;
    }
    ;
    if (!await checkChannels(command, message.channel.id)) {
      message.reply("Вы не можете использовать эту команду здесь!");
      return;
    }
    let user = JSON.parse(JSON.stringify(guild.options.economy.users.find(user => user.id === message.author.id) || ""));
    if (!user) {
      let embed = new MessageEmbed()
        .setDescription("👹 Работать можно только с подземелья.")
        .setColor("#eb4034");
      message.reply({embeds: [embed]});
      return;
    }

    if (user.workCountdown > new Date().getTime()){
      let embed = new MessageEmbed()
        .setDescription(`👹 Вы сможете работать <t:${Math.floor(user.workCountdown/1000)}:R>.`)
        .setColor("#eb4034");
      await message.reply({embeds: [embed]});
      return;
    }

    user.silverCoins = user.silverCoins;
    user.workCountdown  = new Date().getTime() + 1000 * 60 * 60 * 3
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

    let random = Math.floor(Math.random() * (3 - 0 + 1) + 0);

    if (random === 0) {
      let question = Math.floor(Math.random() * 500) + " + " + Math.floor(Math.random() * 500) + " + " + Math.floor(Math.random() * 500);
      let embed = new MessageEmbed()
        .setDescription("👹 Решите пример " + question + ". У вас 30 секунд.")
        .setColor("#378f00");
      await message.reply({embeds: [embed]});

      let filter = (mes) => mes.author.id === message.author.id;
      await message.channel.awaitMessages({filter, max: 1, time: 30000, errors: ['time']})
        .then(async collected => {
          if (+(collected.first().content.trim()) !== +eval(question)) {
            let embed = new MessageEmbed()
              .setDescription("👹 Ответ не правильный!")
              .setColor("#eb4034");
            await message.reply({embeds: [embed]});
            user.workCountdown  = new Date().getTime() + 1000 * 60 * 60 * 3;
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
          } else {
            // adding coins
            let coins = Math.floor(Math.random() * (60 - 20 + 1) + 20);
            let embed = new MessageEmbed()
              .setDescription("👹 Поздравляю, вы получили " + coins + "<:silver_coin:965239170459136041>")
              .setColor("#378f00");
            await message.reply({embeds: [embed]});
            user.silverCoins += coins;
            user.workCountdown  = new Date().getTime() + 1000 * 60 * 60 * 3;
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
          }
        }).catch(async () => {
          let embed = new MessageEmbed()
            .setDescription("👹 Вы не успели ответить! Правильный ответ - " + +eval(question))
            .setColor("#eb4034");
          message.reply({embeds: [embed]});
          user.workCountdown = new Date().getTime() + 1000 * 60 * 60 * 3;
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
        });
    }
    if (random === 1) {
      let coins = Math.floor(Math.random() * (30 - 10 + 1) + 10);
      let embed = new MessageEmbed()
        .setDescription("👹 Поздравляю, вы получили " + coins + "<:silver_coin:965239170459136041>")
        .setColor("#378f00");
      await message.reply({embeds: [embed]});
      user.silverCoins += coins;
      user.workCountdown  = new Date().getTime() + 1000 * 60 * 60 * 3
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
    }
    if (random === 2) {
      let board = new Array(81).fill("🕸");
      board = board.map((item, index) => index !== 8 && (index - 8) % 9 !== 0 ? (Math.random() <= 0.3 ? "🕷" : "🕸") : `\n`)
      let embed = new MessageEmbed()
        .setDescription(`👹 Посчитайте количество паучков на паутине. У вас 45 секунд.\n${board.join("")}`)
        .setColor("#378f00");
      await message.reply({embeds: [embed]});
      let filter = (mes) => mes.author.id === message.author.id;
      await message.channel.awaitMessages({filter, max: 1, time: 45000, errors: ['time']})
        .then(async collected => {
            if (+collected.first().content !== board.filter(item => item === "🕷").length){
              let embed = new MessageEmbed()
                .setDescription("👹 Ответ не правильный!")
                .setColor("#eb4034");
              await message.reply({embeds: [embed]});
              user.workCountdown  = new Date().getTime() + 1000 * 60 * 60 * 3;
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
              return;
            }
            let coins = Math.floor(Math.random() * (65 - 40 + 1) + 40);
            let embed = new MessageEmbed()
              .setDescription("👹 Поздравляю, вы получили " + coins + "<:silver_coin:965239170459136041>")
              .setColor("#378f00");
            await message.reply({embeds: [embed]});
            user.silverCoins += coins;
            user.workCountdown  = new Date().getTime() + 1000 * 60 * 60 * 3
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
          }
        ).catch(async () => {
          let embed = new MessageEmbed()
            .setDescription("👹 Вы не успели ответить! Правильный ответ - " + board.filter(item => item === "🕷").length)
            .setColor("#eb4034");
          message.reply({embeds: [embed]});
          user.workCountdown  = new Date().getTime() + 1000 * 60 * 3;
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
        });
    }
    if (random === 3) {
      let coins = Math.floor((user.swordDamage + user.bowDamage + user.magicDamage * 3) * Math.random() * 10 + (user.hp + user.defence * 2) / 10)
      let embed = new MessageEmbed()
        .setDescription(`${characters.find(ch => ch.name === user.selectedCharacter)?.icon} Ваш герой принёс вам ${coins}<:silver_coin:965239170459136041>`)
        .setColor("#378f00");
      await message.reply({embeds: [embed]});
      user.silverCoins += coins;
      user.workCountdown  = new Date().getTime() + 1000 * 60 * 60 * 3
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
    }
  }
}