const {prefix} = require('../config.json');

module.exports = {
    name: "ban",
    description: "Банит пользователя на сервере.",
    example: `${prefix}ban [mention or id] [reason]`,
    category: "mod",
    execute: async function(message){
        let messageArray = message.content.split(' ');
        let command = messageArray[0];
        let args = messageArray.slice(1);

        message.reply("ban");
    }
}