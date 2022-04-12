const { Permissions } = require('discord.js');

module.exports = {
  async checkRoles(command, user){
    if (command.rolesWhiteList.includes("everyone")){
      return true;
    }
    if (command.rolesWhiteList.includes("admins") && user.permissions.has(Permissions.FLAGS.ADMINISTRATOR)){
      return true
    }
    if (user.roles.cache.some(role => command.rolesWhiteList.some(wrole => wrole === role.id))) {
      return true
    }
    else{
      return false
    }
  },
  async checkChannels(command, channelId){
    if (command.channelWhiteList.includes("all")){
      return true;
    }
    if (command.channelWhiteList.includes(channelId)) {
      return true;
    }
    else{
      return false;
    }
  }
}