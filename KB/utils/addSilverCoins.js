module.exports = async function(user,guild,coins){

  user.silverCoins += coins;

  let resultArray = [];
  for (let usr of JSON.parse(JSON.stringify(guild.options.economy.users || []))){
    if (usr.id === user.id){
      resultArray.push(user);
    }
    else{
      resultArray.push(usr);
    }
  }

  guild.options = {...guild.options, economy: {...guild.options.economy, users: resultArray}};
  guild.markModified("options")
  return guild.save();
}