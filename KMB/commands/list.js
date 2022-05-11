const {prefix} = require("../config.json");
let colors = require("../../KB/utils/colors");
const {checkRoles, checkChannels} = require("../../KB/utils/checkAvailability");
const {MessageEmbed} = require("discord.js");

module.exports = {
  name: "list",
  description: "Показывает список всех треков.",
  example: `${prefix}list`,
  category: "music",
  execute: async function (message, command, dbGuild, player, changeVoice, getVoice) {
    let member = await message.guild.members.fetch(message.author.id);
    if (!await checkRoles(command, member)) {
      let embed = new MessageEmbed().setDescription("Вы не можете использовать эту команду!").setColor(colors.grayRed);
      message.reply({embeds: [embed]}).catch(e => e);
      return;
    }
    if (!await checkChannels(command, message.channel.id)) {
      let embed = new MessageEmbed().setDescription("Вы не можете использовать эту команду здесь!").setColor(colors.grayRed);
      message.reply({embeds: [embed]}).catch(e => e);
      return;
    }

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      let embed = new MessageEmbed().setDescription("Ты должен быть в голосовом канале для использования этой команды!").setColor(colors.grayRed);
      return message.reply({embeds: [embed]}).catch(e => e);
    }
    if (getVoice() && getVoice() !== voiceChannel.id) {
      let embed = new MessageEmbed().setDescription("Бот уже воспроизводит музыку в другом войс канале!").setColor(colors.grayRed);
      return message.reply({embeds: [embed]}).catch(e => e);
    }

    const queue = player.getQueue(message.guild.id);
    if (!queue || !queue.playing){
      let embed = new MessageEmbed().setDescription("❌ | Ничего не играет!").setColor(colors.grayRed);
      return message.reply({embeds: [embed]}).catch(e => e);
    }
    let mes = '';
    const currentTrack = queue.current;
    let count = 1;
    let embed = new MessageEmbed().setColor(colors.blue);
    mes += `🎶 **${currentTrack.title}** 🎶\n\n`
    for (let elem of queue.tracks) {
      mes += `${count}. - ${elem.title}`;
      count++;
    }
    embed.setDescription(mes);
    message.reply({embeds: [embed]})
  }
}
