const {prefix} = require("../config.json");
const {checkRoles, checkChannels} = require("../utils/checkAvailability");
const {MessageEmbed, MessageActionRow, MessageButton} = require("discord.js");
const characters = require("../modules/economy/characters");
const getUserFromMention = require("../utils/getUserFromMention");

function indexToXY(index){
  return {
    x: index % 10 + 1,
    y: Math.floor(index/10) + 1
  }
}
function xYtoIndex(x, y){
  return (y-1) * 10 + x - 1
}
function render(battle, oldPlayerPos, newPlayerPos, playerIcon){
  console.log(oldPlayerPos, newPlayerPos)
  battle[xYtoIndex(oldPlayerPos.x, oldPlayerPos.y)] = "⬛";
  battle[xYtoIndex(newPlayerPos.x, newPlayerPos.y)] = playerIcon;
}

function loop (battle, playerXY, row1, row2, mes, embed, user1, user2, message){
  const filter = (i) => {
    i.deferUpdate();
    return i.user.id === message.author.id;
  }
  mes.awaitMessageComponent({filter, componentType: 'BUTTON', time:100000 })
    .then(async ( i) => {
      console.log(i)
      let newPos;
      switch (i.customId){
        case "up":
          newPos = JSON.parse(JSON.stringify(playerXY));
          newPos.y -= 1;
          render(battle, playerXY, newPos, characters.find(ch => ch.name === user1.selectedCharacter).icon);
          embed.setDescription(`${battle.join("")}`);
          await mes.edit({embeds: [embed], components: [row1, row2]});
          loop(battle,playerXY, row1, row2, mes, embed, user1, user2, message);
          break;
        case "bottom":
          newPos = JSON.parse(JSON.stringify(playerXY));
          newPos.y += 1;
          render(battle, playerXY, newPos, characters.find(ch => ch.name === user1.selectedCharacter).icon);
          embed.setDescription(`${battle.join("")}`);
          await mes.edit({embeds: [embed], components: [row1, row2]});
          loop(battle,playerXY, row1, row2, mes, embed, user1, user2, message);
          break;
        case "right":
          newPos = JSON.parse(JSON.stringify(playerXY));
          newPos.x += 1;
          render(battle, playerXY, newPos, characters.find(ch => ch.name === user1.selectedCharacter).icon);
          embed.setDescription(`${battle.join("")}`);
          await mes.edit({embeds: [embed], components: [row1, row2]});
          loop(battle,playerXY, row1, row2, mes, embed, user1, user2, message);
          break;
        case "left":
          newPos = JSON.parse(JSON.stringify(playerXY));
          newPos.x -= 1;
          render(battle, playerXY, newPos, characters.find(ch => ch.name === user1.selectedCharacter).icon);
          embed.setDescription(`${battle.join("")}`);
          await mes.edit({embeds: [embed], components: [row1, row2]});
          loop(battle,playerXY, row1, row2, mes, embed, user1, user2, message);
          break;
      }
    })
    .catch((i) => {
      console.log(i)
    })
}


module.exports = {
  name: "fight",
  description: "Напасть на игрока.",
  example: `${prefix}shop [id или mention]`,
  category: "economy",
  execute: async function (message, command, guild) {
    if (!guild.options.economy.on) return;
    let messageArray = message.content.split(' ');
    let args = messageArray.slice(1);
    let member = await message.guild.members.fetch(message.author.id);
    if (!await checkRoles(command, member)) {
      message.reply("Вы не можете использовать данную команду!");
      return;
    };
    if (!await checkChannels(command, message.channel.id)) {
      message.reply("Вы не можете использовать эту команду здесь!");
      return;
    }
    let user1 = JSON.parse(JSON.stringify(guild.options.economy.users.find(user => user.id === message.author.id) || ""));
    if (!user1) {
      let embed = new MessageEmbed()
        .setDescription("👹 Работать можно только с подземелья.")
        .setColor("#eb4034");
      message.reply({embeds: [embed]});
      return;
    }
    if (!args[0]){
      message.reply(`⛔ Неверный формат команды, упомяните или укажите айди пользователя (\`${this.example}\`)`);
      return;
    }
    let user2 = await getUserFromMention(args[0], guild);
    if (!user2){
      try{
        user2 = await message.guild.members.fetch(args[0]);
      }catch (e) {}
    }
    if (!user2){
      message.reply("Пользователь не найден.");
      return;
    }

    user2 = JSON.parse(JSON.stringify(guild.options.economy.users.find(user => user.id === user2.id) || ""));
    if (!user2) {
      message.reply("Пользователь не найден.");
      return;
    }

    let battle = new Array(10 * 9).fill("⬛").map((item, index) => index === 9 || (index-9) % 10 === 0 ? `\n` : index >= 40 && index < 50 && index !== 43 && index !== 44 && index !== 45  ? "🔲" : item);
    battle[14] = characters.find(ch => ch.name === user2.selectedCharacter).icon;
    battle[74] = characters.find(ch => ch.name === user1.selectedCharacter).icon;
    let embed = new MessageEmbed()
      .setDescription(`${battle.join("")}`)
      .setColor("#313131");
    const row1 = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId("none1")
          .setEmoji("⬛")
          .setStyle("SECONDARY"),
        new MessageButton()
          .setCustomId("up")
          .setEmoji("⬆")
          .setStyle("PRIMARY"),
        new MessageButton()
          .setCustomId("none2")
          .setEmoji("⬛")
          .setStyle("SECONDARY"),
        new MessageButton()
          .setCustomId("sword")
          .setEmoji("🗡️")
          .setStyle("DANGER"),
        new MessageButton()
          .setCustomId("bow")
          .setEmoji("🏹")
          .setStyle("DANGER")
      );
    const row2 = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId("left")
          .setEmoji("⬅")
          .setStyle("PRIMARY"),
        new MessageButton()
          .setCustomId("bottom")
          .setEmoji("⬇")
          .setStyle("PRIMARY"),
        new MessageButton()
          .setCustomId("right")
          .setEmoji("➡")
          .setStyle("PRIMARY"),
        new MessageButton()
          .setCustomId("magic")
          .setEmoji("🔮")
          .setStyle("DANGER"),
        new MessageButton()
          .setCustomId("super")
          .setEmoji("⚡")
          .setStyle("SUCCESS")
      );

    let playerXY = indexToXY(74);

    let mes = await message.reply({embeds: [embed], components: [row1, row2]});

    loop(battle,playerXY, row1, row2, mes, embed, user1, user2, message);

  }
}