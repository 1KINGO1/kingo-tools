const {prefix} = require('../config.json');
const {checkRoles, checkChannels} = require("../utils/checkAvailability");
const getUserFromMention = require("../utils/getUserFromMention");
const logger = require("../modules/loggerMod");
const {MessageEmbed} = require("discord.js");
const colors = require("../utils/colors");

module.exports = {
    name: "unban",
    description: "Разбанит пользователя на сервере.",
    example: `${prefix}unban [mention or id] [?reason]`,
    category: "mod",
    execute: async function(message, command, dbGuild, client){
        let messageArray = message.content.split(' ');
        let args = messageArray.slice(1);
        let guild = message.guild;
        let member = await guild.members.fetch(message.author.id);
        if (!await checkRoles(command, member)){
            let embed = new MessageEmbed().setDescription("Вы не можете использовать эту команду!").setColor(colors.grayRed);
            message.reply({embeds: [embed]});
            return;
        }
        if (!await checkChannels(command, message.channel.id)){
            let embed = new MessageEmbed().setDescription("Вы не можете использовать эту команду здесь!").setColor(colors.grayRed);
            message.reply({embeds: [embed]});
            return;
        }

        if (!args[0]){
            let embed = new MessageEmbed().setDescription(`⛔ Неверный формат команды, упомяните или укажите айди пользователя (\`${this.example}\`)`).setColor(colors.grayRed);
            message.reply({embeds: [embed]});
            return;
        }

        try{
            await guild.members.unban(args[0], args[1] || "Без причины");
            let embed = new MessageEmbed().setDescription(`<@${args[0]}> был разбанен ✅`).setColor(colors.green);
            message.reply({embeds: [embed]});
            await logger(dbGuild, {type: "BAN_REMOVE", category: "mod", offender: {id: args[0]}, name: "ban remove", reason: args[2] || "Без причины", mod: message.author}, client)
        }catch (e){
            let embed = new MessageEmbed().setDescription(`Не удалось разбанить <@${args[0]}> ❌`).setColor(colors.gray);
            message.reply({embeds: [embed]});
        }
    }
}