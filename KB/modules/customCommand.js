const {checkRoles, checkChannels} = require("../utils/checkAvailability");
const {MessageEmbed} = require("discord.js");
const colors = require("../utils/colors");
module.exports = async function(message, options, guild, client){
  let member = await message.guild.members.fetch(message.author.id);
  let args = message.content.split(" ").slice(1, );

  if (!await checkRoles(options, member)) {
    let embed = new MessageEmbed().setDescription("Вы не можете использовать эту команду!").setColor(colors.grayRed);
    message.reply({embeds: [embed]}).catch(e => e);
    return;
  }
  if (!await checkChannels(options, message.channel.id) && options.sendChannel !== "current") {
    let embed = new MessageEmbed().setDescription("Вы не можете использовать эту команду здесь!").setColor(colors.grayRed);
    message.reply({embeds: [embed]}).catch(e => e);
    return;
  }
  let mes;
  try{
    mes = options.text
      .replaceAll("{author.id}", message.author.id)
      .replaceAll("{author.tag}", message.author.tag)
      .replaceAll("{channel.id}", message.channel.id)
      .replaceAll("{channel.name}", message.channel.name)
      .replaceAll("{guild.name}", message.guild.name)
      .replaceAll("{guild.id}", message.guild.id)
      .replaceAll("{guild.rolesCount}", message.guild.roles.cache.size)
      .replaceAll("{guild.channelCount}", message.guild.channels.cache.size)
      .replaceAll("{guild.memberCount}", message.guild.memberCount)
      .replaceAll("{unix}", Math.floor((new Date().getTime())/1000))
      .replaceAll("{mention.id}", message.mentions.members.first()?.id || "")
      .replaceAll("{mention.tag}", message.mentions.members.first()?.user?.tag || "")
      .replace(/\{args\[([0-9])(,)?]}/g, (match, p1, p2) => {
        if (p2){
          return args.slice(+p1 - 1,).join(" ")
        }
        else{
          return args[+p1 - 1]
        }
      })
      //Actions
      .replace(/<command\.delete>/g, () => {
        try{
          message.delete();
        }catch (e) {}
        return "";
      })
      .replace(/<author\.role\.add\(([0-9]+)\)>/g, (match, p1) => {
        try{
          message.guild.roles.fetch(p1).then(role => {
            member.roles.add(role);
          }).catch(e => e);
        }catch (e) {}
        return "";
      })
      .replace(/<author\.role\.remove\(([0-9]+)\)>/g, (match, p1) => {
        try{
            member.roles.remove(p1).catch(e => e)
        }catch (e) {}
        return "";
      })

  }catch (e) {return console.log(e)}

  if (options.sendChannel === "current"){
    await message.channel.send(JSON.parse(mes)).catch(e => e);
  }
  else{
    try{
      let channel = await message.guild.channels.fetch(options.sendChannel).catch(e => e);
      channel.send(JSON.parse(mes)).catch(e => e);
    }catch (e) {return console.log(e)}
  }

}