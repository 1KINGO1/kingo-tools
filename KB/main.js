const mongoose = require("mongoose");
const {Intents, Collection, MessageEmbed} = require('discord.js');
const fs = require("fs");
const Discord = require('discord.js')
const {Routes} = require('discord-api-types/v9');
const client = new Discord.Client({
  intents: new Discord.Intents(32767),
  partials: ['MESSAGE', 'CHANNEL', 'REACTION', "GUILD_MEMBER"]
});
const reactionRoles = require("./modules/reactionRoles");
let colors = require("./utils/colors");

const {token, prefix} = require('./config.json');

//MODULES
const antiScamLinks = require("./modules/anti-scam-links");
const levels = require("./modules/levels");
const path = require("path");
const {REST} = require("@discordjs/rest");
const logger = require("./modules/loggerMod");

mongoose.connect('mongodb+srv://fsdfsdfsdf:aYZdwxlnetcEVTzr@cluster0.epd8a.mongodb.net/kingo-tools?retryWrites=true&w=majority').then(() => {
  console.log("Database connected")
});

const User = mongoose.model('User', {
  login: String,
  password: String,
  flags: Array,
  discord: Object
});

const Guild = mongoose.model("Server", {
  id: String,
  owner_id: String,
  options: Object,
  data: Object
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message, author) => {

  if (message.author.bot) return;

  let guild = await Guild.findOne({id: message.guild.id});

  if (!guild || !guild.options.allowed) {
    message.reply({content: "Вы не можете использовать данного бота на этом сервере :("});
    return;
  }
  ;

  //Anti Scam Links
  if (guild?.options?.antiScamLinks?.on) {
    await antiScamLinks(message, guild.options.antiScamLinks, guild, client)
  }

  //Levels
  if (guild?.options?.levelSystem?.on) {
    await levels(message, guild, await message.guild.members.fetch(message.author.id));
  }

  if (!message.content.startsWith(prefix)) return;
  let messageArray = message.content.split(' ');

  //Commands
  let command = guild.options.commands.find((command) => command?.alternative?.some(com => prefix + com === messageArray[0]) || prefix + command.name === messageArray[0]);
  if (!command) {
    return;
  }
  ;
  const messageObj = require(`./commands/${command.name}`);
  if (command.on) {
    await messageObj.execute(message, command, guild, client);
  }

});
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.user.bot) return;

  let guild = await Guild.findOne({id: interaction.guild.id});

  if (!guild || !guild.options.allowed) {
    interaction.reply({content: "Вы не можете использовать данного бота на этом сервере :(", ephemeral: false});
    return;
  }
  let command = guild.options.commands.find((command) => command.name === interaction.commandName || command?.alternative?.includes(interaction.commandName));
  console.log(command);
  if (!command) {
    return;
  }
  const messageObj = require(`./commands/${command.name}`);
  if (command.on) {
    await messageObj.executeLikeSlash(interaction, command, guild, client);
  }
})

client.on("guildCreate", async guild => {

  {
    let server = Guild.findOne({id: guild.id});

    if (server) {
      await server.remove();
    }
  }

  const pathArray = fs.readdirSync(path.join(__dirname, "commands"), {withFileTypes: true});

  let commands = [];

  for (const p of pathArray) {
    const command = require("./commands/" + p.name);
    commands.push(command);
  }

  commands = commands.map(({name, description, example, category, alternative, useSlash}) => {
    return {
      name, description, example, category, alternative,
      on: true,
      isSlash: !!useSlash,
      rolesWhiteList: [],
      channelWhiteList: []
    }
  });

  let server = new Guild({
    id: guild.id,
    owner_id: guild.ownerId,
    options: {
      allowed: false,
      antiScamLinks: {
        on: false,
        cssChecker: false,
        websiteIconChecker: false,
        inSiteBlackWordsList: [],
        inSiteTitleBlackWordsList: [],
        blackListWords: [],
        punishment: {
          name: "timeout",
          reason: "",
          duration: 0
        }
      },
      levelSystem: {
        on: false,
        xpCoefficient: 1,
        deleteRolesAfterNewLevel: true,
        xpFarmWhiteListChannels: [],
        whiteListRoles: [],
        levelRoles: [],
        users: []
      },
      economy: {
        on: false,
        economyItems: [],
        users: []
      },
      logger: {
        on: false,
        modChannel: "",
        modAllow: [], //["BAN", "KICK", "TIMEOUT", "BAN_REMOVE", "TIMEOUT_REMOVE"]
        messageEventsChannel: "",
        messageEventsAllow: [], // ["MESSAGE_DELETE", "MESSAGE_EDIT", "MESSAGE_PURGED"],
        voiceChannel: "",
        voiceAllow: [], // ["VOICE_JOIN", "VOICE_LEAVE", "VOICE_CHANGE"],
        membersChannel: "",
        membersAllow: [], // ["MEMBER_JOIN", "MEMBER_LEAVE", "MEMBER_ROLE_ADD", "MEMBER_ROLE_REMOVE", "MEMBER_NICKNAME_CHANGE"],
      },
      reactionRole: [],
      commands
    },
    data: {
      name: guild.name,
      joinedAt: guild.joinedAt,
      avatar: guild.iconURL()
    }
  });
  await server.save();
})
client.on("guildDelete", async guild => {

  let server = Guild.findOne({id: guild.id});
  await server.remove();
})

//LOGGER MESSAGES
client.on("messageDelete", async message => {
  let guild = await Guild.findOne({id: message.guild.id});
  if (!guild || !guild.options.allowed) {
    return;
  };
  if (!guild.options.logger.on) return;
  if (!guild.options.logger.messageEventsAllow.includes("MESSAGE_DELETE")) return;
  let channel = await client.channels.fetch(message.channelId);
  let embed = new MessageEmbed()
    .setTitle("Сообщение удалено в " + channel.name)
    .setAuthor(message.author.username + "#" + message.author.discriminator, message.author.displayAvatarURL())
    .setDescription(message.content)
    .setFooter(`ID: ${message.id}`)
    .setTimestamp(new Date())
    .setColor(colors.red)
  try {
    let channel = await client.channels.fetch(guild.options.logger.messageEventsChannel);
    await channel.send({embeds: [embed]})
  } catch (e) {
  }
})
client.on("messageUpdate", async (oldMessage, newMessage) => {
  let guild = await Guild.findOne({id: newMessage.guild.id});
  if (!guild.options.logger.on) return;
  if (!guild || !guild.options.allowed) {
    return;
  };
  if (oldMessage.content.trim() === newMessage.content.trim()) return;
  if (oldMessage.content.trim() === "" || newMessage.content.trim() === "") return;
  if (!guild.options.logger.messageEventsAllow.includes("MESSAGE_EDIT")) return;
  let channel = await client.channels.fetch(newMessage.channelId);
  let embed = new MessageEmbed()
    .setTitle("Сообщение изменено в " + channel.name)
    .setAuthor(newMessage.author.username + "#" + newMessage.author.discriminator, newMessage.author.displayAvatarURL())
    .setDescription(`**Before**: ${oldMessage.content}\n**After**: ${newMessage.content}`)
    .setFooter(`ID: ${newMessage.id}`)
    .setTimestamp(new Date())
    .setColor(colors.yellow)
  try {
    let channel = await client.channels.fetch(guild.options.logger.messageEventsChannel);
    await channel.send({embeds: [embed]})
  } catch (e) {
  }
})

//LOGGER MEMBERS
client.on("guildMemberAdd", async member => {
  let guild = await Guild.findOne({id: member.guild.id});
  if (!guild || !guild.options.allowed) {
    return;
  };
  if (!guild.options.logger.on) return;
  if (!guild.options.logger.membersAllow.includes("MEMBER_JOIN")) return;
  let embed = new MessageEmbed()
    .setTitle("Пользователь зашёл")
    .setAuthor(member.user.username + "#" + member.user.discriminator, member.user.displayAvatarURL())
    .setFooter(`ID: ${member.id}`)
    .setTimestamp(new Date())
    .setColor(colors.green)
  try {
    let channel = await client.channels.fetch(guild.options.logger.membersChannel);
    await channel.send({embeds: [embed]})
  } catch (e) {
  }
})
client.on("guildMemberRemove", async member => {
  let guild = await Guild.findOne({id: member.guild.id});
  if (!guild.options.logger.on) return;
  if (!guild.options.logger.membersAllow.includes("MEMBER_LEAVE")) return;
  if (!guild || !guild.options.allowed) {
    return;
  };
  let embed = new MessageEmbed()
    .setTitle("Пользователь вышел")
    .setAuthor(member.user.username + "#" + member.user.discriminator, member.user.displayAvatarURL())
    .setDescription(`Роли: ${member.roles.cache.filter(role => role.name !== "@everyone").map(role => `<@&${role.id}>`).join(" ") || "Отсутствуют."}`)
    .setFooter(`ID: ${member.id}`)
    .setTimestamp(new Date())
    .setColor(colors.red)
  try {
    let channel = await client.channels.fetch(guild.options.logger.membersChannel);
    await channel.send({embeds: [embed]})
  } catch (e) {
  }
})
client.on("guildMemberUpdate", async (oldMember, newMember) => {
  await newMember.guild.members.fetch();
  let guild = await Guild.findOne({id: newMember.guild.id});
  if (!guild || !guild.options.allowed) {
    return;
  };
  if (!guild.options.logger.on) return;
  if (JSON.stringify(oldMember.roles.cache) !== JSON.stringify(newMember.roles.cache) && oldMember.roles.cache && newMember.roles.cache && oldMember.roles.cache.size !== newMember.roles.cache.size) {
    let embed = new MessageEmbed()
      .setTitle("Роли пользователя изменены")
      .setAuthor(newMember.user.username + "#" + newMember.user.discriminator, newMember.user.displayAvatarURL())
      .setFooter(`ID: ${newMember.id}`)
      .setTimestamp(new Date())
      .setColor(colors.purple);
    let addRoles = [];
    let removeRoles = [];
    for (let role of oldMember.roles.cache) {
      if (!await newMember.roles.cache.find(r => r.id === role[0])) {
        removeRoles.push(role);
      }
    }
    for (let role of newMember.roles.cache) {
      if (!await oldMember.roles.cache.find(r => r.id === role[0])) {
        addRoles.push(role);
      }
    }

    embed.setDescription(`${addRoles.length !== 0 && guild.options.logger.membersAllow.includes("MEMBER_ROLE_ADD") ? `**+** ${addRoles.map(r => `<@&${r[0]}>`).join(" ")}\n` : ""}${removeRoles.length !== 0 && guild.options.logger.membersAllow.includes("MEMBER_ROLE_REMOVE") ? `**-** ${removeRoles.map(r => `<@&${r[0]}>`).join(" ")}\n` : ""}`)
    try {
      let channel = await client.channels.fetch(guild.options.logger.membersChannel);
      if (!embed.description.trim()) return;
      await channel.send({embeds: [embed]})
    } catch (e) {
    }
  }
  if (oldMember.nickname !== newMember.nickname && guild.options.logger.membersAllow.includes("MEMBER_NICKNAME_CHANGE") && oldMember && newMember) {
    let embed = new MessageEmbed()
      .setTitle("Никнейм пользователя изменен")
      .setAuthor(newMember.user.username + "#" + newMember.user.discriminator, newMember.user.displayAvatarURL())
      .setFooter(`ID: ${newMember.id}`)
      .setTimestamp(new Date())
      .setDescription(`**After**: ${oldMember.nickname || oldMember.user.username}\n**Before**: ${newMember.nickname || newMember.user.username}`)
      .setColor(colors.blue)
    try {
      let channel = await client.channels.fetch(guild.options.logger.membersChannel);
      await channel.send({embeds: [embed]})
    } catch (e) {
    }
    return
  }
})

//LOGGER VOICE
client.on("voiceStateUpdate", async (oldState, newState) => {
  let guild = await Guild.findOne({id: oldState.guild.id || newState.guild.id});
  if (!guild.options.logger.on) return;
  if (!guild || !guild.options.allowed) {
    return;
  };
  if (newState.channelId !== null && oldState.channelId !== null && guild.options.logger.voiceAllow.includes("VOICE_CHANGE")) {
    let embed = new MessageEmbed()
      .setTitle("Пользователь поменял войс")
      .setAuthor(oldState.member.user.username + "#" + oldState.member.user.discriminator, oldState.member.user.displayAvatarURL())
      .setFooter(`ID: ${oldState.member.id}`)
      .setTimestamp(new Date())
      .setDescription(`**After**: <#${oldState.channelId}>\n**Before**: <#${newState.channelId}>`)
      .setColor(colors.blue)
    try {
      let channel = await client.channels.fetch(guild.options.logger.voiceChannel);
      await channel.send({embeds: [embed]})
      return;
    } catch (e) {
      console.log(e)
    }
  }
  if (newState.channelId === null && guild.options.logger.voiceAllow.includes("VOICE_LEAVE")) {
    let embed = new MessageEmbed()
      .setTitle("Пользователь вышел с канала")
      .setAuthor(oldState.member.user.username + "#" + oldState.member.user.discriminator, oldState.member.user.displayAvatarURL())
      .setFooter(`ID: ${oldState.member.id}`)
      .setTimestamp(new Date())
      .setDescription(`${oldState.member.user.username + "#" + oldState.member.user.discriminator} вышел с <#${oldState.channelId}>`)
      .setColor(colors.orange)
    try {
      let channel = await client.channels.fetch(guild.options.logger.voiceChannel);
      await channel.send({embeds: [embed]})
      return;
    } catch (e) {
      console.log(e)
    }
  }
  if (oldState.channelId === null && guild.options.logger.voiceAllow.includes("VOICE_JOIN")) {
    let embed = new MessageEmbed()
      .setTitle("Пользователь зашёл в канал")
      .setAuthor(newState.member.user.username + "#" + newState.member.user.discriminator, newState.member.user.displayAvatarURL())
      .setFooter(`ID: ${oldState.member.id}`)
      .setTimestamp(new Date())
      .setDescription(`${newState.member.user.username + "#" + newState.member.user.discriminator} зашёл в с <#${newState.channelId}>`)
      .setColor(colors.green)
    try {
      let channel = await client.channels.fetch(guild.options.logger.voiceChannel);
      await channel.send({embeds: [embed]})
      return;
    } catch (e) {
      console.log(e)
    }
  }
})

//LOGGER MOD
client.on("guildBanRemove", async (ban) => {
  let guild = await Guild.findOne({id: ban.guild.id});
  if (!guild.options.logger.on) return;
  if (!guild || !guild.options.allowed) {
    return;
  };
  await logger(guild, {
    type: "BAN_REMOVE",
    category: "mod",
    offender: {id: ban.user.id},
    name: "ban remove",
    reason: ban.reason,
    mod: "unknown"
  });
})
client.on("guildBanAdd", async (ban) => {
  let guild = await Guild.findOne({id: ban.guild.id});
  if (!guild.options.logger.on) return;
  if (!guild || !guild.options.allowed) {
    return;
  };
  await logger(guild, {
    type: "BAN",
    category: "mod",
    offender: {id: ban.user.id},
    name: "ban",
    reason: ban.reason,
    mod: "unknown"
  });
})
client.on("messageReactionAdd", async (reaction, user) => {
  let guild = await Guild.findOne({id: reaction.message.guild.id});
  if (!guild.options.logger.on) return;
  if (!guild || !guild.options.allowed) {
    return;
  };
  reactionRoles(guild, reaction, user, client, "add")
});
client.on("messageReactionRemove", async (reaction, user) => {
  let guild = await Guild.findOne({id: reaction.message.guild.id});
  if (!guild.options.logger.on) return;
  if (!guild || !guild.options.allowed) {
    return;
  };
  reactionRoles(guild, reaction, user, client, "remove")
})
client.login(token).then(() => {
  setInterval(async () => {
    let guilds = await Guild.find({});
    guilds.forEach(g => {
      const CLIENT_ID = client.user.id;
      const GUILD_ID = g.id
      const rest = new REST({
        version: '9'
      }).setToken(token);

      let commands = [];
      const pathArray = fs.readdirSync(path.join(__dirname, "commands"), {withFileTypes: true});
      for (const p of pathArray) {
        const command = require("./commands/" + p.name);
        if (command.useSlash && g.options.commands.find(com => com.name === command.name).on) {
          if (!g.options.levelSystem.on && command.category === "levels") continue;
          if (!g.options.economy.on && command.category === "economy") continue;
          commands.push(command.data.toJSON());
        }
      }
      (async () => {
        try {
          if (!GUILD_ID) {
            await rest.put(
              Routes.applicationCommands(CLIENT_ID), {
                body: commands
              },
            );
            console.log('Successfully registered application commands globally');
          } else {
            await rest.put(
              Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
                body: commands
              },
            );
            console.log('Successfully registered application commands for development guild');
          }
        } catch (error) {
          if (error) console.error(error);
        }
      })();
    });
  }, 1000 * 60 * 5)
});

module.exports = {
  client,
  User
}