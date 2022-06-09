const {prefix} = require("../config.json");
const {checkRoles, checkChannels} = require("../utils/checkAvailability");
const dateParser = require("../utils/dateParser");
const {Reminds, Guild} = require("../main");
const {MessageEmbed} = require("discord.js");
let colors = require("../utils/colors");
const getUserFromMention = require("../utils/getUserFromMention");
module.exports = {
  name: "roleusers",
  description: "Показывает список пользователей с ролью.",
  example: `${prefix}roleusers [role]`,
  category: "roles",
  execute: async function (message, command, dbGuild, client) {
    let messageArray = message.content.split(' ').filter(a => a.trim());
    let args = messageArray.slice(1);
    let guild = message.guild;
    let member = await guild.members.fetch(message.author.id);
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
    if (!args[0]) {
      let embed = new MessageEmbed().setDescription(`Неверный формат команды! (\`${this.example}\`)`).setColor(colors.grayRed);
      message.reply({embeds: [embed]}).catch(e => e);
      return;
    }

    let role = await getUserFromMention(args[0], guild);
    if (!role){
      try{
        role = await message.guild.roles.fetch(args[0]).catch(e => e);
      }catch (e) {}
    }

    if (!role){
      let embed = new MessageEmbed().setDescription("⛔ Роль не найдена!").setColor(colors.gray);
      message.reply({embeds: [embed]}).catch(e => e);
      return;
    }
    let count = 1;
    let embed = new MessageEmbed()
      .setTitle(`Пользователи с ${role.name}`)
      .setDescription(role.members.map((member, index) => {
        return `${count++}. <@${member.id}>  \`${member.user.tag}\``
      }).slice(0,50).join("\n") || "Нет пользователей.")
      .setTimestamp(new Date())
      .setFooter(`Первые 50 человек`);
    message.reply({embeds: [embed]}).catch(e => e);
  }
}