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
];

const BOT_TOKEN = "OTU2NTA3ODAzMzk1MTc4NTQ5.YjxPTw.mwPbEQWwBMaUleOPvLjYmh0QNj0";

const User = mongoose.model('User', {
  login: String,
  password: String,
  flags: Array,
  discord: Object
});

const Guild = mongoose.model("Server", {
  id: String,
  owner_id: String,
  options: Object,
  data: Object
})

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

  if (Object.keys(user.discord || {}).length > 0) {
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

  //refreshing guilds
  let discordToken = null;
  let refreshToken = null;

  const params = new URLSearchParams()
  params.append('client_id', '956507803395178549');
  params.append('client_secret', 'fo2R8GvvwpvVROrXu_LyRoQwnXrfuddb');
  params.append('grant_type', 'refresh_token');
  params.append('refresh_token', user.discord.refreshToken)

  axios.post("https://discord.com/api/oauth2/token", params, {
    'Content-Type': 'application/x-www-form-urlencoded'
  }).then(async ({data}) => {
    discordToken = data.access_token;
    refreshToken = data.refresh_token;

    console.log(refreshToken);
    console.log(discordToken);

    user.discord = {...user.discord, refreshToken};
    await user.save();

    const {data: guilds} = await axios.get("https://discord.com/api/users/@me/guilds", {
      headers:{
        "Authorization": `Bearer ${discordToken}`
      }
    });

    user.discord.guilds = guilds;
    await user.save();

    res.send({err: false, guilds: user.discord.guilds.filter(guild => guild.owner)});

  }).catch((e) => {
    res.send({err: true, message: "Ошибка обновления серверов"})
  })
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

//Link Discord
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
  let refreshToken = null;

  axios.post("https://discord.com/api/oauth2/token", params,{
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }).then(async ({data}) => {

    type = data.token_type;
    discordToken = data.access_token;
    refreshToken = data.refresh_token;


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

              user.discord = {...userData, guilds, refreshToken};
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

//Fetch Server Data
app.get("/api/fetchGuildData", async (req, res) => {
  const {token} = req.cookies;
  const {serverId} = req.query;

  const user = await verifyToken(token);
  if (!user || !token){
    res.send({err: true, message: "Укажите токен!"});
    return;
  }
  if (!user.flags.some(flag => flag.id === 1)){
    res.send({err: true, message: "Вы не можете использовать этот функционал!"});
    return;
  }
  if (Object.keys(user.discord).length === 0){
    res.send({err: true, message: "Discord аккаунт не привязан"});
    return;
  }

  if(!user.discord.guilds.find(guild => guild.id === serverId)){
    res.send({err: true, message: "Вы не владеете данным серверов"});
    return;
  }

  let guild = await Guild.findOne({id: serverId});

  if (!guild){
    res.send({err: false, message: "Добавьте бота на сервер"});
    return;
  }
  else{
    res.send({err: false, guild});
    return;
  }
})

//editing server config
app.post("/api/config", async (req, res) => {

  /* ==== req body structure ====


  * type => change_field | on_module | off_module
  * payload => something data
  * guild_id => guild id
  * module => module name in database
  * property => module property to change
  *
  * */

  const {token} = req.cookies;

  const {type, payload, guild_id, module, property} = req.body;

  const user = await verifyToken(token);
  if (!user || !type || (!payload && typeof payload !== "boolean") || !guild_id || !module || !property){
    res.send({err: true, message: "Incorrect form data"});
    return;
  }
  if (!user.flags.some(flag => flag.id === 1)){
    res.send({err: true, message: "Вы не можете использовать этот функционал!"});
    return;
  }
  if (Object.keys(user.discord).length === 0){
    res.send({err: true, message: "Discord аккаунт не привязан"});
    return;
  }

  if(!user.discord.guilds.find(guild => guild.id === guild_id)){
    res.send({err: true, message: "Вы не владеете данным серверов"});
    return;
  }

  let guild = await Guild.findOne({id: guild_id});

  if(!guild){
    res.send({err: true, message: "Сервер не найден"});
    return;
  }

  if (!guild.options.hasOwnProperty(module)){
    res.send({err: true, message: "Модуль не найден!"});
    return;
  }

  switch (type) {
    case "change_field":

      if (!guild.options[module].hasOwnProperty(property)){
        res.send({err: true, message: "Свойство не найдено!"});
        return;
      }

      if (typeof guild.options[module][property] !== typeof payload){
        res.send({err: true, message: "Неверные данные для изменения!"});
        return;
      }

      if (property === "punishment"){
        switch (true){
          case ("name" in payload):
            guild.options = {...guild.options, [module]: {...guild.options[module], [property]: {...guild.options[module][property], name: payload.name}}}
            break;
          case ("duration" in payload):
            guild.options = {...guild.options, [module]: {...guild.options[module], [property]: {...guild.options[module][property], duration: payload.duration}}}
            break;
          case ("reason" in payload):
            guild.options = {...guild.options, [module]: {...guild.options[module], [property]: {...guild.options[module][property], reason: payload.reason}}}
            break;
        }
        await guild.save();
        res.send({err: false})
      }
      else{
        guild.options = {...guild.options, [module]: {...guild.options[module], [property]: payload}}

        await guild.save();
        res.send({err: false})
      }

      break;

    case "on_module":
      guild.options = {...guild.options, [module]: {...guild.options[module], on: true}};
      guild.save().then(() => {
        res.send({err: false})
      });
      break;

    case "off_module":
      guild.options = {...guild.options, [module]: {...guild.options[module], on: false}};
      guild.save().then(() => {
        res.send({err: false})
      });
      break;

    default:
      res.send({err: true, message: "Action не найден!"});
      return;
  }

})

app.get("*", async (req, res) => {
  await log(`**[** \`${req.path}\` \`${req.method}\` **]** - ${req.headers['x-forwarded-for']?.split(',').shift()}`);
  res.sendFile(path.join(path.dirname(__dirname), "client" ,"build", "index.html"));
})

app.listen(process.env.PORT || 3001, () => {
  console.log(`Server running on port ${process.env.PORT || 3001}`)
})