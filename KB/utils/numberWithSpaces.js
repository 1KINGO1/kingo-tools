module.exports = function numberWithSpaces(num, space){
  return (num + "").replace(/\B(?=(\d{3})+(?!\d))/g, space);
}