module.exports = async function getUserFromMention(mention, guild){
    if (!mention) return;

    if (mention.startsWith('<@&') && mention.endsWith('>')){
      mention = mention.slice(3, -1);
      if (mention.startsWith('!')) {
        mention = mention.slice(1);
      }
      return guild.roles.cache.get(mention);
    }

    if (mention.startsWith('<@') && mention.endsWith('>')) {
      mention = mention.slice(2, -1);

      if (mention.startsWith('!')) {
        mention = mention.slice(1);
      }

      return guild.members.cache.get(mention);
    }
}