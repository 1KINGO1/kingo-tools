module.exports = function parseLink(str){
    let strArr = str.split('');
    for (let i = 0; i < strArr.length; i++){
        //if word is link
        if (strArr.join('').startsWith('https://') || strArr.join('').startsWith('http://')){
            return strArr.join('');
        }
        //else, delete first symbol of word
        else{
            strArr[i] = undefined;
        }
    }
}