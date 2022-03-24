import config from "../config/config";
import axios from "axios";
import {User} from "../store/actions/authActions";

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
}