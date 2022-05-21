const {prefix} = require("../config.json");
let colors = require("../utils/colors");
const {MessageEmbed} = require("discord.js");
module.exports = {
  name: "sockets",
  description: "Показывает список всех подключённых сокетов.",
  example: `${prefix}sockets`,
  category: "admin",
  execute: async function (message, command, guild, client, io) {
    if(message.author.id !== "633580579035676673") return;
    try{
      let embed = new MessageEmbed()
        .setTitle("Подключённые сокеты")
        .setColor(colors.gray);
      io.sockets.sockets.forEach(socket => {
        embed.addField(socket?.id, `Login: ${socket?.data?.user?.login}\nDiscord: <@${socket?.data?.user?.discord?.id}>`, true)
      });
      message.reply({embeds: [embed]}).catch(e => e);
    }catch (e) {console.log(e)}
  }
}