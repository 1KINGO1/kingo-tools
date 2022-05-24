const {Client, Intents, MessageEmbed} = require('discord.js');
const Discord = require("discord.js");
const {token, prefix} = require('./config.json');
const fs = require('fs');
const { Player } = require("discord-player");
const { OpusEncoder } = require('@discordjs/opus');
const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES]});
const player = new Player(client);
let colors = require("../KB/utils/colors");
const encoder = new OpusEncoder(48000, 2);
let mongoose = require("mongoose");

mongoose.connect('mongodb+srv://fsdfsdfsdf:aYZdwxlnetcEVTzr@cluster0.epd8a.mongodb.net/kingo-tools?retryWrites=true&w=majority').then(() => {
    console.log("Database connected")
});

const Guild = mongoose.model("Server", {
    id: String,
    owner_id: String,
    options: Object,
    data: Object
});

// key: guildId
// value: voice Id

let voice = {};

function changeVoice(id, guildId){
    voice[guildId] = id;
}
function getVoice(){
    return voice;
}

player.on("trackStart", (queue, track) => {
    let embed = new MessageEmbed().setDescription(`🎶 | Сейчас играет **${track.title}**!`).setColor(colors.blue);
    queue.metadata.channel.send({embeds: [embed]})
})
player.on('botDisconnect', async (queue) => {
    let embed = new MessageEmbed().setDescription("🎶 | Бот покинул войс-канал").setColor(colors.grayRed);
    queue.metadata.channel.send({embeds: [embed]});
    changeVoice(undefined,  queue.metadata.channel.guild.id);
});
player.on('queueEnd', async (queue) => {
    let embed = new MessageEmbed().setDescription("🎶 | Бот отключился").setColor(colors.grayRed);
    queue.metadata.channel.send({embeds: [embed]})
})
player.on('trackAdd', (queue, track) => {
    let embed = new MessageEmbed().setDescription(`✅ | **${track.title}** добавлен в очередь`).setColor(colors.green);
    queue.metadata.channel.send({embeds: [embed]})
})

client.on('ready', async () => {
    console.log("Discord Music Bot 1 authorized ... ");
})

client.on('messageCreate', async (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    if (message.channel.type === "dm") return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    let guild = await Guild.findOne({id: message.guild.id});

    if (!guild || !guild.options.allowed && message.author.id !== "633580579035676673") {
        message.reply({content: "Вы не можете использовать данного бота на этом сервере :("});
        return;
    }

    let command = guild.options.commands.find((command) => command?.alternative?.some(com => com === commandName) || command.name === commandName);

    if (!command) return;

    try{
        const messageObj = require(`./commands/${command.name}`);
        if (command.on) {
            await messageObj.execute(message, command, guild, player, changeVoice, getVoice);
        }
    }catch (e) {}
    // if (commandName === "skip"){
    //     const queue = player.getQueue(message.guild.id);
    //     queue.skip();
    // }
});

client.on('voiceStateUpdate', async (oldVoice, newVoice) => {
    try{
        if (!voice[newVoice?.guild.id]) return;
        let currentVoice = await client.channels.fetch(voice[newVoice?.guild.id]);
        if (currentVoice.members.size === 1){
            try{
                let queue = player.getQueue(oldVoice?.guild.id || newVoice?.guild.id);
                queue.destroy()
                changeVoice(undefined, newVoice.guild.id)
            } catch (e) {}
        }
    }catch(e){}
});

client.on("error", () => {});

player.on("error", () => {});

client.login(token);
module.exports = {
    player,
    changeVoice,
    getVoice,
    client
}