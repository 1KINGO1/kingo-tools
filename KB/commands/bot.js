const {prefix} = require("../config.json");
let colors = require("../utils/colors");
const {MessageEmbed} = require("discord.js");
const fs = require("fs");
const path = require("path");
const {Guild, Reminds} = require("../main");
module.exports = {
  name: "bot",
  description: "Информация о боте.",
  example: `${prefix}bot`,
  category: "admin",
  execute: async function (message, command, guild) {
    if(message.author.id !== "633580579035676673") return;
    try {

      function format(seconds){
        function pad(s){
          return (s < 10 ? '0' : '') + s;
        }
        let hours = Math.floor(seconds / (60*60));
        let minutes = Math.floor(seconds % (60*60) / 60);
        seconds = Math.floor(seconds % 60);

        return pad(hours) + 'h ' + pad(minutes) + 'm ' + pad(seconds) + 's';
      }

      let uptime = process.uptime();

      const pathArray = fs.readdirSync(__dirname, {withFileTypes: true});
      let commands = [];
      for (const p of pathArray) {
        const command = require("./" + p.name);
        commands.push(command);
      }

      let embed = new MessageEmbed()
        .setTitle("Информация о боте")
        .setColor(colors.purple)
        .addField("Uptime:", format(uptime), true)
        .addField("Команд:", commands.length + "", true)
        .addField("Серверов:", (await Guild.find({})).length + "", true)
        .addField("Напоминалок:", (await Reminds.find({})).length + "", true)
      message.channel.send({embeds: [embed]})
    }catch (e) {console.log(e)}
  }
}