const parseLink = require("../utils/parseLink");
const checkLink = require("../utils/checkLink");
const applyPunishment = require("../utils/applyPunishment");

module.exports = async function antiScamLinks(message, options, guild, client){

    let {punishment} = options;

    try{
        let content = message.content.toLowerCase()
        if (options.blackListWords.some((elem) => content.includes(elem.toLowerCase())) && options.blackListWords.join("").trim() !== ""){
            applyPunishment(message, punishment, guild, client);
        }
    }catch (e) {}
    let messArr = message.content.split(' ');
    for (let word of messArr){
        if (word.includes('https://') || word.includes('http://')){
            let link = parseLink(word);
            let check = await checkLink(link, options);
            if (check){
                applyPunishment(message, punishment, guild, client);
            }
        }
    }
}