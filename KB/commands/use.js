const {prefix} = require("../config.json");
const {checkRoles, checkChannels} = require("../utils/checkAvailability");
const {MessageEmbed, MessageActionRow, MessageButton} = require("discord.js");
const items = require("../modules/economy/items");
module.exports = {
  name: "use",
  description: "Использовать предмет",
  example: `${prefix}use [item name]`,
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
        .setDescription("👹 Вы не можете использовать данную команду!.")
        .setColor("#eb4034");
      message.reply({embeds: [embed]});
      return;
    }
    if (!args[0]){
      let embed = new MessageEmbed()
        .setDescription("👹 Укажите название предмета")
        .setColor("#eb4034");
      message.reply({embeds: [embed]});
      return;
    }
    let itemI = user.inventory.find(item => item.name.toLowerCase().includes(args.join().trim().toLowerCase()));
    if (!itemI){
      let embed = new MessageEmbed()
        .setDescription("👹 Предмет не найден!")
        .setColor("#eb4034");
      message.reply({embeds: [embed]});
      return
    }

    if (itemI.type === "farm"){
      let embed = new MessageEmbed()
        .setDescription(`👹Данный предмет нельзя использовать!`)
        .setColor("#eb4034");
      message.reply({embeds: [embed]});
      return
    }

    let item = items.find(item => item.name.toLowerCase().includes(args.join().trim().toLowerCase()));
    if (item){
        await item.onUse(guild, user, message);
        let embed = new MessageEmbed()
          .setDescription(`Предмет использован!`)
          .setColor("#378f00");
        message.reply({embeds: [embed]});
    }
    else{
      item = itemI;
      if (itemI.type !== "discord_item"){
        let embed = new MessageEmbed()
          .setDescription("👹 Предмет не найден!")
          .setColor("#eb4034");
        return message.reply({embeds: [embed]});
      }
      await message.reply(itemI.text);
    }

    let newInventory = [];
    for (let i of user.inventory){
      if (i.name === item.name){
        i.amount -= 1;
        if (i.amount > 0){
          newInventory.push(i)
        }
      }
      else{
        newInventory.push(i)
      }
    }
    user.inventory = newInventory;

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
  }
}