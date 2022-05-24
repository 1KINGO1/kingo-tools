const {prefix} = require("../config.json");
let colors = require("../../KB/utils/colors");
const {checkRoles, checkChannels} = require("../../KB/utils/checkAvailability");
const {MessageEmbed} = require("discord.js");

module.exports = {
  name: "resume",
  description: "Восстанавливает воспроизведение треков.",
  example: `${prefix}resume`,
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
    if (getVoice()[message.guild.id] && getVoice()[message.guild.id] !== voiceChannel.id) {
      let embed = new MessageEmbed().setDescription("Бот уже воспроизводит музыку в другом войс канале!").setColor(colors.grayRed);
      return message.reply({embeds: [embed]}).catch(e => e);
    }

    const queue = player.getQueue(message.guild.id);
    queue.setPaused(false)
    const currentTrack = queue.current;
    let embed = new MessageEmbed().setDescription(`▶ | Трэк восстановлен! ${currentTrack.title}`).setColor(colors.blue);
    return message.reply({embeds: [embed]}).catch(e => e);
  }
}
