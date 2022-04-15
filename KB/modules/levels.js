const calcLevelByXp = require("../utils/calcLevelByXp");

module.exports = async function levels(message, guild, member){
  let user = JSON.parse(JSON.stringify(guild.options.levelSystem.users.find(user => user.id === message.author.id) || ""));

  if (!user){
    user = {
      id: message.author.id,
      totalXP: 0,
      themeColor: "#fff",
      secondThemeColor: "#8c8c8c",
      backgroundImage: ""
    };

    guild.options = {...guild.options, levelSystem: {...guild.options.levelSystem,  users: [...guild.options.levelSystem.users, user]}};
    await guild.save();
  }

  if (!member.roles.cache.some(role => guild.options.levelSystem.whiteListRoles.includes(role.id)) && !guild.options.levelSystem.whiteListRoles.includes("all")){
    return;
  }

  if (guild.options.levelSystem.xpFarmWhiteListChannels.includes("all") || guild.options.levelSystem.xpFarmWhiteListChannels.includes(message.channel.id)){
    let messagePoints = Math.round(Math.random() * guild.options.levelSystem.xpCoefficient * 15);

    let old_statistic = calcLevelByXp(user.totalXP);
    let new_statistic = calcLevelByXp(user.totalXP + messagePoints);

    user.totalXP += messagePoints;

    let resultArray = [];
    for (let usr of JSON.parse(JSON.stringify(guild.options.levelSystem.users))){
      if (usr.id === user.id){
        resultArray.push(user);
      }
      else{
        resultArray.push(usr);
      }
    }
    guild.options = {...guild.options, levelSystem: {...guild.options.levelSystem,  users: resultArray}};
    await guild.save();

    if (old_statistic.level < new_statistic.level){

      if (guild.options.levelSystem.deleteRolesAfterNewLevel){
          try{
            guild.options.levelSystem.levelRoles.forEach(role => {
              member.roles.remove(role.roleId).catch(e => {});
            })
          }catch (e){}
      }

      try{
        let roleId = guild.options.levelSystem.levelRoles.find(rule => rule.levelRequired === new_statistic.level)?.roleId;
        if (!roleId){
          return;
        }
        let role = member.guild.roles.cache.find(role => role.id === roleId);
        await member.roles.add(role);
      }catch (e){}

    }
  }

}