const {prefix} = require('../config.json');
const {checkRoles, checkChannels} = require("../utils/checkAvailability");
const getUserFromMention = require("../utils/getUserFromMention");

module.exports = {
    name: "unban",
    description: "Разбанит пользователя на сервере.",
    example: `${prefix}unban [mention or id] [?reason]`,
    category: "mod",
    execute: async function(message, command){
        let messageArray = message.content.split(' ');
        let args = messageArray.slice(1);
        let guild = message.guild;
        let member = await guild.members.fetch(message.author.id);
        if (!await checkRoles(command, member)){
            message.reply("Вы не можете разбанить пользователей!");
            return;
        };
        if (!await checkChannels(command, message.channel.id)){
            message.reply("Вы не можете использовать эту команду здесь!");
            return;
        }

        if (!args[0]){
            message.reply(`⛔ Неверный формат команды, упомяните или укажите айди пользователя (\`${this.example}\`)`);
            return;
        }

        try{
            await guild.members.unban(args[0], args[1] || "Без причины");
            message.reply(`<@${args[0]}> был разбанен ✅`);
        }catch (e){
            message.reply(`Не удалось разбанить <@${args[0]}> ❌`);
        }
    }
}