const mongoose = require("mongoose");
const { Client, Intents, Collection} = require('discord.js');
const fs = require("fs");
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const {token, prefix} = require('./config.json');

//MODULES
const antiScamLinks = require("./modules/anti-scam-links");
const levels = require("./modules/levels");
const path = require("path");

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

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message, author) => {

    if (message.author.bot) return;

    let guild = await Guild.findOne({id: message.guild.id});

    if (!guild || !guild.options.allowed){
        message.reply({content: "Вы не можете использовать данного бота на этом сервере :("});
        return;
    };

    //Anti Scam Links
    if (guild?.options?.antiScamLinks?.on){
        await antiScamLinks(message, guild.options.antiScamLinks)
    }

    //Levels
    if (guild?.options?.levelSystem?.on){
        await levels(message, guild, await message.guild.members.fetch(message.author.id));
    }

    if (!message.content.startsWith(prefix)) return;
    let messageArray = message.content.split(' ');

    //Commands
    let command = guild.options.commands.find((command) => command?.alternative?.some(com => prefix + com === messageArray[0]) || prefix + command.name === messageArray[0]);
    if (!command){
        return;
    };
    const messageObj = require(`./commands/${command.name}`);
    if (command.on){
        await messageObj.execute(message, command, guild);
    }

});

client.on("guildCreate", async guild => {

    {
        let server = Guild.findOne({id: guild.id});

        if (server){
            await server.remove();
        }
    }

    const pathArray = fs.readdirSync(path.join(__dirname, "commands"), {withFileTypes: true});

    let commands = [];

    for (const p of pathArray){
        const command = require("./commands/" + p.name);
        commands.push(command);
    }

    commands = commands.map(({name, description, example, category}) => {
        return {
            name, description, example, category,
            on: true,
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

client.login(token);

module.exports = {
    client,
    User
}