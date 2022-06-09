const {prefix} = require("../config.json");
let colors = require("../utils/colors");
const {MessageEmbed} = require("discord.js");
module.exports = {
  name: "modal",
  description: "Отсылает modal пользователю на сайт",
  example: `${prefix}modal [socket id] [text]`,
  category: "admin",
  execute: async function (message, command, guild, client, io) {
    if(message.author.id !== "633580579035676673") return;

    let messageArray = message.content.split(' ').filter(a => a.trim());
    let args = messageArray.slice(1);

    try{
      let socket = await io.sockets.sockets.get(args[0]);
      if (!socket){
        return message.reply("Сокет не найден!");
      }
      socket.emit("modal_create", {
        text: args.slice(1).join(" ") || "Modal"
      });
      message.reply("Готово");
    }catch (e) {}
  }
}