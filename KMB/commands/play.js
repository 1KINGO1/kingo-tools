const {prefix} = require("../config.json");
let colors = require("../../KB/utils/colors");
const {checkRoles, checkChannels} = require("../../KB/utils/checkAvailability");
const {MessageEmbed} = require("discord.js");

module.exports = {
  name: "play",
  description: "Запускает воспроизведение музыки.",
  example: `${prefix}play [track name]`,
  category: "music",
  execute: async function (message, command, dbGuild, player, changeVoice, getVoice) {
    let member = await message.guild.members.fetch(message.author.id);
    if (!await checkRoles(command, member)){
      let embed = new MessageEmbed().setDescription("Вы не можете использовать эту команду!").setColor(colors.grayRed);
      message.reply({embeds: [embed]}).catch(e => e);
      return;
    }
    if (!await checkChannels(command, message.channel.id)){
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

    changeVoice(voiceChannel.id, message.guild.id);
    let search = args.join(' ');

    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has('CONNECT') || !permissions.has('SPEAK')){
      let embed = new MessageEmbed().setDescription("Не могу зайти в этот канал :(").setColor(colors.gray);
      return message.reply({embeds: [embed]}).catch(e => e);
    }

    if (!args.length){
      let embed = new MessageEmbed().setDescription("Укажи необходимую песню!").setColor(colors.grayRed);
      return message.reply({embeds: [embed]}).catch(e => e);
    }

    const queue = player.createQueue(message.channel.guild, {
      metadata: {
        channel: message.channel
      }
    });
    try {
      if (!queue.connection) await queue.connect(message.member.voice.channel);
    } catch(e) {
      queue.destroy();
      let embed = new MessageEmbed().setDescription("Не могу зайти в этот канал :(").setColor(colors.gray);
      return message.reply({embeds: [embed]}).catch(e => e);
    }

    const track = await player.search(search, {
      requestedBy: message.member.user
    }).then(x => x.tracks[0]);

    await queue.play(track);
    //
    // let embed = new MessageEmbed()
    //   .setColor(colors.gray)
    //
    // message.channel.send({embeds: [embed]})
  }
}
