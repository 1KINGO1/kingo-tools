const {prefix} = require("../config.json");
const {checkRoles, checkChannels} = require("../utils/checkAvailability");
const getUserFromMention = require("../utils/getUserFromMention");
const {MessageEmbed} = require("discord.js");
module.exports = {
  name: "avatar",
  alternative: ["a"],
  description: "Показывает аватар пользователя.",
  example: `${prefix}a [?mention or id]`,
  category: "utils",
  execute: async function(message, command){
    let messageArray = message.content.split(' ');
    let args = messageArray.slice(1);
    let guild = message.guild;
    let member = await guild.members.fetch(message.author.id);
    if (!await checkRoles(command, member)){
      message.reply("Вы не можете использовать эту команду!");
      return;
    };
    if (!await checkChannels(command, message.channel.id)){
      message.reply("Вы не можете использовать эту команду здесь!");
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
        message.reply("Пользователь не найден.");
        return;
      }
      else{
        user = mentionedUser;
      }
    }

    const embed = new MessageEmbed()
      .setColor("#7f6ce5")
      .setTitle(`Аватар ${user.user.tag}`)
      .setImage(user.user.displayAvatarURL({size:1024,dynamic:true}));
    await message.reply({embeds: [embed]}).catch(e => {})
  }
}