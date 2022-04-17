const {prefix} = require('../config.json');
const {checkRoles, checkChannels} = require("../utils/checkAvailability");
const getUserFromMention = require("../utils/getUserFromMention");
const logger = require("../modules/logger");

module.exports = {
    name: "ban",
    description: "Банит пользователя на сервере.",
    example: `${prefix}ban [mention or id] [?reason]`,
    category: "mod",
    execute: async function(message, command, dbGuild){
        let messageArray = message.content.split(' ');
        let args = messageArray.slice(1);
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

        if (!args[0]){
            message.reply(`⛔ Неверный формат команды, упомяните или укажите айди пользователя (\`${this.example}\`)`);
            return;
        }

        let banMember = await getUserFromMention(args[0], guild);
        if (!banMember){
            try{
                banMember = await guild.members.fetch(args[0]);
            }catch (e) {}
        }
        if (!banMember){
            message.reply("Пользователь не найден.");
            return;
        }

        let banMemberRolePosition = banMember.roles.cache.reduce((prev, item) => item.position > prev ? item.position : prev, -1);
        let authorRolePosition = member.roles.cache.reduce((prev, item) => item.position > prev ? item.position : prev, -1);

        if (banMemberRolePosition >= authorRolePosition && member.id !== guild.ownerId){
            message.reply("⛔ Вы не можете забанить пользователя, который имеет позицию роли выше вашей!");
            return;
        }

        try{
            await guild.members.ban(banMember.id, {reason: args[1] || "Без причины"});
            message.reply(`${banMember.user.tag} был забанен ✅`);
            await logger(dbGuild, {type: "BAN", category: "mod", offender: banMember.user, name: "ban", reason: args[2] || "Без причины", mod: message.author})
        }catch (e){
            message.reply(`Не удалось забанить ${banMember.user.tag} ❌`);
        }
    }
}