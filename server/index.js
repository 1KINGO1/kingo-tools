const express = require("express");
const app = express();
const {createToken, decodeToken} = require("./utils");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const {CLIENT_URL, REDIRECT_URL} = require("./config");
const axios = require("axios");
const path = require("path");
mongoose.connect('mongodb+srv://fsdfsdfsdf:aYZdwxlnetcEVTzr@cluster0.epd8a.mongodb.net/kingo-tools?retryWrites=true&w=majority').then(() => {
  console.log("Database connected")
});

const flags = [
  {
    id: 1,
    title: "User",
    color: "cyan"
  },
  {
    id: 2,
    title: "Admin",
    color: "gold"
  }
]

const User = mongoose.model('User', {
  login: String,
  password: String,
  flags: Array,
  discord: Object
});

const verifyToken = async (token) => {
  if (!token){
    return false;
  }

  let user;

  try{
    const decode = await decodeToken(token);
    user = await User.findOne({login: decode.login});
  }catch (e) {
    return false;
  };

  if (user){
    return user;
  }
  else{
    return false;
  }
}

async function log(mes){
  const {data} = await axios.post(`https://discord.com/api/webhooks/944552933742223370/1zM4hTTk6eln4rOcX5wAUp1Cub8IGpKoBxJhWOcK33ok151rAdVSq-Qa86vtTGXYrCU-`, {
    content: mes
  });
  console.log(data);
}

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
}));
app.use(express.static(path.join(path.dirname(__dirname), "client" ,"build")))

app.get("/", async (req, res) => {
  await log(`**[** \`${req.path}\` \`${req.method}\` **]** - ${req.headers['x-forwarded-for']?.split(',').shift()}`);
  res.sendFile(path.join(path.dirname(__dirname), "client" ,"build", "index.html"));
});

app.post("/api/login", async (req, res) => {
  const {login, password} = req.body;
  await log(`**[** \`${req.path}\` \`${req.method}\` **]** - ${req.headers['x-forwarded-for']?.split(',').shift()} | \`${login}\` \`${password}\` `);

  if (!login || !password){
    res.send({err: true, message: "Заполните все поля!"});
    return;
  }

  const user = await User.findOne({login});

  if (!user){
    res.send({err: true, message: "Пользователь не найден!"});
    return;
  }

  if (user.password !== password){
    res.send({err: true, message: "Неправильный пароль!"});
    return;
  }

  const token = await createToken(user.login);

  res.cookie("token", token)
  res.send({err: false, token});
});

app.post("/api/registration", async (req, res) => {
  const {login, password} = req.body;

  if (!login || !password){
    res.send({err: true, message: "Заполните все поля!"});
    return;
  }

  if (password.length < 10){
    res.send({err: true, message: "Пароль должен содержать больше 9-ти символов!"});
    return;
  }

  const checkUser = await User.findOne({login});

  if (checkUser){
    res.send({err: true, message: "Логин занят."});
    return;
  }

  const user = new User({login, password, flags: [], discord: {}});
  await user.save();

  res.send({err: false});
})

app.post("/api/verify", async (req, res) => {
  await log(`**[** \`${req.path}\` \`${req.method}\` **]** - ${req.headers['x-forwarded-for']?.split(',').shift()}`);
  const {token} = req.body;

  if (!token){
    res.send({err: true});
    return;
  }

  let decode;

  try{
    decode = await decodeToken(token);
  }catch (e) {
    res.send({err: true});
    return;
  }

  let user = await User.findOne({login: decode?.login});

  if (user){
    res.send({err: false});
  }
  else{
    res.send({err: true});
  }

});

app.get("/api/data", async (req, res) => {
  await log(`**[** \`${req.path}\` \`${req.method}\` **]** - ${req.headers['x-forwarded-for']?.split(',').shift()}`);
  const {token} = req.cookies;
  if (!token){
    res.send({err: true});
    return;
  }

  let user;

  try{
    const decode = await decodeToken(token);
    user = await User.findOne({login: decode.login});
  }catch (e) {
    res.send({err: true});
    return;
  };

  if (Object.keys(user.discord).length > 0) {
    delete user.discord.guilds;
    res.send({login: user.login, flags: user.flags, discord: user.discord});
  }
  else{
    res.send({login: user.login, flags: user.flags, discord: user.discord});
  }

});

app.get("/api/fetchGuilds", async (req, res) => {
  const {token} = req.cookies;
  if (!token){
    res.send({err: true});
    return;
  }

  let user;

  try{
    const decode = await decodeToken(token);
    user = await User.findOne({login: decode.login});
  }catch (e) {
    res.send({err: true});
    return;
  };

  if (Object.keys(user.discord).length === 0){
    res.send({err: true});
    return;
  }

  res.send({err: false, guilds: user.discord.guilds.filter(guild => guild.owner)});
})

/*Discord Client Bot*/
/*FLAG - 1*/
app.post("/api/dcb/login", async (req, res) => {
  await log(`**[** \`${req.path}\` \`${req.method}\` **]** - ${req.headers['x-forwarded-for']?.split(',').shift()}`);
  const {token} = req.cookies;
  const {token: discordToken} = req.body;

  const user = await verifyToken(token);
  if (!user || !discordToken){
    res.send({err: true, message: "Укажите токен!"});
    return;
  }
  if (!user.flags.some(flag => flag.id === 1)){
    res.send({err: true, message: "Вы не можете использовать этот функционал!"});
    return;
  }

  //Connecting to account
  let result = false;
  try{
    await axios.patch(`https://discord.com/api/v9/users/@me/settings`, {
      client_status:{
        mobile: "online"
      }
    }, {headers: {
        authorization: discordToken
      }})
    result = true;
  }
  catch (e){
    result = false;
  }

  if (result){
    res.send({err: false, message: "Пользователь авторизован!"});
  }
  else{
    res.send({err: true, message: "Неверный токен!"})
  }

})

app.post("/api/dcb/command", async (req, res) => {
  await log(`**[** \`${req.path}\` \`${req.method}\` **]** - ${req.headers['x-forwarded-for']?.split(',').shift()}`);
  const {method, body, path, authToken} = req.body;
  const {token} = req.cookies;

  const user = await verifyToken(token);
  if (!user || !token){
    res.send({err: true, message: "Укажите токен!"});
    return;
  }
  if (!user.flags.some(flag => flag.id === 1)){
    res.send({err: true, message: "Вы не можете использовать этот функционал!"});
    return;
  }

  if (!method || !path || !authToken){
    res.status(400).send({err: true, message: "Bad Request"});
    return;
  }

  try{
    if (method === "get" || method === "delete"){
      const {data} = await axios[method](`https://discord.com/api/v9/${path}`, {headers: {
          authorization: authToken
      }});
      res.send({err: false, message: data});
      return;
    }
    else{
      const {data} = await axios[method](`https://discord.com/api/v9/${path}`,body , {headers: {
          authorization: authToken
      }});
      res.send({err: false, message: data});
      return;
    }

  }catch (e) {
    res.send({err: false, message: e});
    return;
  }

});

/*ADMIN PAGE*/

app.get("/api/admin/users", async (req, res) => {
  await log(`**[** \`${req.path}\` \`${req.method}\` **]** - ${req.headers['x-forwarded-for']?.split(',').shift()}`);
  const {token} = req.cookies;

  const user = await verifyToken(token);
  if (!user || !token){
    res.send({err: true, message: "Укажите токен!"});
    return;
  }
  if (!user.flags.some(flag => flag.id === 2)){
    res.send({err: true, message: "Вы не можете использовать этот функционал!"});
    return;
  }

  const users = await User.find({});
  res.send({err: false, users});
});

app.post("/api/admin/create", async (req, res) => {
  await log(`**[** \`${req.path}\` \`${req.method}\` **]** - ${req.headers['x-forwarded-for']?.split(',').shift()}`);
  const {token} = req.cookies;
  const {login, password} = req.body;
  const user = await verifyToken(token);
  if (!user || !token){
    res.send({err: true, message: "Укажите токен!"});
    return;
  }
  if (!user.flags.some(flag => flag.id === 2)){
    res.send({err: true, message: "Вы не можете использовать этот функционал!"});
    return;
  }
  if (!login, !password){
    res.send({err: true, message: "Заполните все поля!"});
    return;
  }

  const checkUser = await User.findOne({login});

  if (checkUser){
    res.send({err: true, message: "Пользователь с таким Login уже существует."});
    return;
  }

  const newUser = new User({login, password, flags: [], discord: {}});
  await newUser.save();
  res.send({err: false});
});

app.post("/api/admin/delete", async (req, res) => {
  await log(`**[** \`${req.path}\` \`${req.method}\` **]** - ${req.headers['x-forwarded-for']?.split(',').shift()}`);
  const {token} = req.cookies;
  const {login} = req.body;
  const user = await verifyToken(token);
  if (!user || !token){
    res.send({err: true, message: "Укажите токен!"});
    return;
  }
  if (!user.flags.some(flag => flag.id === 2)){
    res.send({err: true, message: "Вы не можете использовать этот функционал!"});
    return;
  }
  if (!login){
    res.send({err: true, message: "Не указан логин!"});
    return;
  }

  const deleteUser = await User.findOne({login});

  if (!deleteUser){
    res.send({err: true, message: "Пользователь не найден!"});
    return;
  }

  await deleteUser.remove();

  res.send({err: false, message: "Успешно!"});
});

app.post("/api/admin/addFlag", async (req, res) => {
  await log(`**[** \`${req.path}\` \`${req.method}\` **]** - ${req.headers['x-forwarded-for']?.split(',').shift()}`);
  const {token} = req.cookies;
  const {login, flagID} = req.body;
  const user = await verifyToken(token);
  if (!user || !token){
    res.send({err: true, message: "Укажите токен!"});
    return;
  }
  if (!user.flags.some(flag => flag.id === 2)){
    res.send({err: true, message: "Вы не можете использовать этот функционал!"});
    return;
  }
  if (!login){
    res.send({err: true, message: "Не указан логин!"});
    return;
  }
  if (!flagID){
    res.send({err: true, message: "Не указан флаг!"});
    return;
  }

  const flag = flags.find(flag => flag.id === flagID);
  if (!flag){
    res.send({err: true, message: "Флага не существует!"});
    return;
  };

  const addUser = await User.findOne({login});
  if (!addUser){
    res.send({err: true, message: "Пользователь не найдён!"});
    return;
  }
  if (addUser.flags.find(flag => flag.id === flagID)){
    res.send({err: true, message: "Пользователь уже имеет данный флаг!"});
    return;
  }

  addUser.flags.push(flag);
  await addUser.save();
  res.send({err: false, message: "Успешно!"});
});

app.post("/api/admin/removeFlag", async (req, res) => {
  await log(`**[** \`${req.path}\` \`${req.method}\` **]** - ${req.headers['x-forwarded-for']?.split(',').shift()}`);
  const {token} = req.cookies;
  const {login, flagID} = req.body;
  const user = await verifyToken(token);
  if (!user || !token){
    res.send({err: true, message: "Укажите токен!"});
    return;
  }
  if (!user.flags.some(flag => flag.id === 2)){
    res.send({err: true, message: "Вы не можете использовать этот функционал!"});
    return;
  }
  if (!login){
    res.send({err: true, message: "Не указан логин!"});
    return;
  }
  if (!flagID){
    res.send({err: true, message: "Не указан флаг!"});
    return;
  }

  const flag = flags.find(flag => flag.id === flagID);
  if (!flag){
    res.send({err: true, message: "Флага не существует!"});
    return;
  };

  const addUser = await User.findOne({login});
  if (!addUser){
    res.send({err: true, message: "Пользователь не найдён!"});
    return;
  }
  if (!addUser.flags.find(flag => flag.id === flagID)){
    res.send({err: true, message: "Пользователь не имеет данный флаг!"});
    return;
  }

  addUser.flags = addUser.flags.filter(flag => flag.id !== flagID);
  await addUser.save();
  res.send({err: false, message: "Успешно!"});
});

app.get("/api/admin/flags", async (req, res) => {
  await log(`**[** \`${req.path}\` \`${req.method}\` **]** - ${req.headers['x-forwarded-for']?.split(',').shift()}`);
  const {token} = req.cookies;
  const user = await verifyToken(token);
  if (!user || !token){
    res.send({err: true, message: "Укажите токен!"});
    return;
  }
  if (!user.flags.some(flag => flag.id === 2)){
    res.send({err: true, message: "Вы не можете использовать этот функционал!"});
    return;
  }

  res.send(flags);
});

app.post("/api/discord", async (req, res) => {
  const {token} = req.cookies;
  const {code} = req.body;

  const user = await verifyToken(token);
  if (!user || !token){
    res.send({err: true, message: "Укажите токен!"});
    return;
  }
  if (!user.flags.some(flag => flag.id === 1)){
    res.send({err: true, message: "Вы не можете использовать этот функционал!"});
    return;
  }
  if (Object.keys(user.discord).length > 0){
    res.send({err: true, message: "Discord аккаунт уже привязан"});
    return;
  }
  if (!code){
    res.send({err: true, message: ""});
    return;
  }

  const params = new URLSearchParams()
  params.append('client_id', '956507803395178549');
  params.append('client_secret', 'fo2R8GvvwpvVROrXu_LyRoQwnXrfuddb');
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', REDIRECT_URL);

  let type = null;
  let discordToken = null;

  axios.post("https://discord.com/api/oauth2/token", params,{
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }).then(async ({data}) => {

    type = data.token_type;
    discordToken = data.access_token;

    axios.get("https://discord.com/api/users/@me", {
      headers:{
        "Authorization": `${type} ${discordToken}`
      }
    }).then(async ({data: userData}) => {

              const {data: guilds} = await axios.get("https://discord.com/api/users/@me/guilds", {
                headers:{
                  "Authorization": `${type} ${discordToken}`
                }
              });

              user.discord = {...userData, guilds};
              await user.save();
              res.send({err: false})




       }).catch((e) => {
              res.send({err: true, message: "Ошибка"})
              console.log(e);
       })
    }).catch((e) => {

      res.send({err: true, message: "Ошибка"})

    });

})

app.get("*", async (req, res) => {
  await log(`**[** \`${req.path}\` \`${req.method}\` **]** - ${req.headers['x-forwarded-for']?.split(',').shift()}`);
  res.sendFile(path.join(path.dirname(__dirname), "client" ,"build", "index.html"));
})

app.listen(process.env.PORT || 3001, () => {
  console.log(`Server running on port ${process.env.PORT || 3001}`)
})