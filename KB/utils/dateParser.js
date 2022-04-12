module.exports = function(str){
  // 1d12h30m
  str = str.replaceAll("w", "*604800000 +");
  str = str.replaceAll("d", "*86400000 +");
  str = str.replaceAll("h", "*3600000 +");
  str = str.replaceAll("m", "*60000 +");
  str = str.replaceAll("s", "*1000 +");
  if (str.endsWith("+")){
    str = str.split("");
    str.push("0");
  }

  return eval(str.join(""));
}