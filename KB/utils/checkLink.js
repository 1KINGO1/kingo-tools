const axios = require('axios');

module.exports = async function checkLink(link, {cssChecker, websiteIconChecker, inSiteBlackWordsList, inSiteTitleBlackWordsList}){
    try{
        // GET Request to link
        let {data: res} = await axios.get(link);
        res = res.toLowerCase();
        let css = cssChecker ? res.includes(`<link rel="stylesheet" href="https://discord.com/assets/0.1fafb1729b3e11fa547c.css">`) : false;
        let icon = websiteIconChecker ? res.includes(`<link rel="icon" href="https://cdn.discordapp.com/attachments/818120722869911602/884002677346943047/847541504914fd33810e70a0ea73177e.png">`) : false;
        let siteHtml = inSiteBlackWordsList ? inSiteBlackWordsList.some((elem) => res.includes(elem.toLowerCase())) : false;
        let siteTitle = inSiteTitleBlackWordsList ? inSiteTitleBlackWordsList.some((elem) => link.includes(elem.toLowerCase())) : false;
        if (
            //checking that current site have official discord css file
            css ||
            //checking if website has a discord icon
            icon ||
            //checking if website includes black words list
            siteHtml ||
            //checking if website title includes black words list
            siteTitle
            //checking that current site isn't official discord website
            && !link.startsWith('https://discord.com/')
            && !link.startsWith(`https://support.discord.com/`)
        ){
            return true
        }
        else{
            return false
        }
    }
    catch(e){
        return false
    }
}