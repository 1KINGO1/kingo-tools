import config from "../config/config";
import axios from "axios";
import {User} from "../store/actions/authActions";
import {LevelSystemRole} from "../types/LevelSystemRole";

interface registerResponse{
  err: boolean,
  message?: string
};

interface loginResponse extends registerResponse{
  token?: string
};

export const register = async (login: string, password: string): Promise<registerResponse> => {
  const {data} = await axios.post(config.API_URL + "/registration", {login, password});
  return data;
};

export const login = async (login: string, password: string): Promise<loginResponse> => {
  const {data} = await axios.post(config.API_URL + "/login", {login, password}, );
  return data;
};

export const verifyToken = async (token: string): Promise<{err: boolean}> => {
  const {data} = await axios.post(config.API_URL + "/verify", {token});
  return data;
};

export const loadData = async (): Promise<{err: boolean} | User> => {
  const {data} = await axios.get(config.API_URL + "/data", {
    withCredentials: true
  });
  return data;
};

export const dcbLogin = async (token: string): Promise<{ err: boolean, message?: string }> => {
  const {data} = await axios.post(config.API_URL + "/dcb/login",{
    token
  } ,{
    withCredentials: true
  });
  return data;
};

export const dcbSend = async (method: string,
                              path: string,
                              body: object,
                              authToken: string) => {
  const {data} = await axios.post(config.API_URL + "/dcb/command", {
    method, path, body, authToken
  }, {
    withCredentials: true
  });

  return data;
};

export const discordLogin = async (code: string) => {
  const {data} = await axios.post(config.API_URL + "/discord", {
    code
  }, {
    withCredentials: true
  });

  return data;
};

export const fetchGuilds = async () => {
  const {data} = await axios.get(config.API_URL + "/fetchGuilds",{
    withCredentials: true
  });
  return data;
};

export const fetchGuildData = async (id: string) => {
  const {data} = await axios.get(config.API_URL + "/fetchGuildData?serverId=" + id,{
    withCredentials: true
  });
  return data;
};

export const toggleModule = async (moduleName: string, guildId: string, action: "on_module" | "off_module") => {
  const {data} = await axios.post(config.API_URL + "/config",{
    type: action,
    payload: "none",
    guild_id: guildId || "none",
    module: moduleName || "none",
    property: "none"
  },{
    withCredentials: true
  });
  return data;
};

export const defineProperty = async (payload: any, guildId: string, moduleName: string, property:string) => {
  const {data} = await axios.post(config.API_URL + "/config",{
    type: "change_field",
    payload,
    guild_id: guildId || "none",
    module: moduleName || "none",
    property: property || "none"
  },{
    withCredentials: true
  });
  return data;
};

export const defineCommandProperty = async (payload: any,
                                            guildId: string,
                                            moduleName: string,
                                            property: "on" | "channelWhiteList" | "rolesWhiteList",
                                            commandName: string) => {
  const {data} = await axios.post(config.API_URL + "/config",{
    type: "change_command",
    payload,
    guild_id: guildId || "none",
    module: moduleName || "none",
    property: property || "none",
    commandName
  },{
    withCredentials: true
  });
  return data;
};

export const updateCommandsData = async (guild_id: string) => {
  const {data} = await axios.post(config.API_URL + "/updateGuildData",{
    guild_id: guild_id || "none"
  },{
    withCredentials: true
  });
  return data;
};

export const defineLevelsRule = async (payload: LevelSystemRole | string,
                                       type: "remove_levels_rule" | "add_levels_rule",
                                       guildId: string) => {
  const {data} = await axios.post(config.API_URL + "/config",{
    type,
    payload,
    guild_id: guildId || "none",
    property: "none",
    module: "levelSystem"
  },{
    withCredentials: true
  });
  return data;
}