const {prefix} = require('../config.json');
const {client} = require("../main");
const {checkRoles, checkChannels} = require("../utils/checkAvailability");

module.exports = {
  name: "ping",
  description: "Пингует бота.",
  example: `${prefix}ping`,
  category: "utils",
  execute: async function(message, command){
    let messageArray = message.content.split(' ');
    let guild = message.guild;
    let member = await guild.members.fetch(message.author.id);

    if (!await checkRoles(command, member)){
      message.reply("Вы не можете банить пользователей!");
      return;
    };
    if (!await checkChannels(command, message.channel.id)){
      message.reply("Вы не можете использовать эту команду здесь!");
      return;
    }

    message.reply(`Pong! Websocket heartbeat: \`${client.ws.ping}ms\``);
  }
}