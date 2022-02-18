const jwt = require("jsonwebtoken");
const fs = require("fs");

const KEY = fs.readFileSync(__dirname + "/jwtRS256.key");

const createToken = async (login) => {
  return await jwt.sign({ login }, KEY, { algorithm: 'RS256'});
}

const decodeToken = async (token) => {
  try{
    return await jwt.decode(token, KEY, { algorithms: ['RS256'] });
  }
  catch (e) {
    return false;
  }
}

module.exports = {
  createToken,
  decodeToken
}