import axios from "axios";
import config from "../config/config";

export const getUsers = async () => {
  const {data} = await axios.get(config.API_URL + "/admin/users", {
    withCredentials: true
  });
  return data;
};

export const createUser = async (login: string, password: string) => {
  if (!login || !password){
    return {err: true, message: "Заполните все поля!"}
  }
  const {data} =  await axios.post(config.API_URL + "/admin/create", {
    login, password
  }, {withCredentials: true});
  return data;
}

export const deleteUser = async (login: string) => {
  const {data} =  await axios.post(config.API_URL + "/admin/delete", {
    login
  }, {withCredentials: true});
  return data;
}

export const addFlag = async (login: string, flagID: number) => {
  const {data} =  await axios.post(config.API_URL + "/admin/addFlag", {
    login, flagID
  }, {withCredentials: true});
  return data;
}

export const removeFlag = async (login: string, flagID: number) => {
  const {data} =  await axios.post(config.API_URL + "/admin/removeFlag", {
    login, flagID
  }, {withCredentials: true});
  return data;
}

export const getFlags = async () => {
  const {data} =  await axios.get(config.API_URL + "/admin/flags", {withCredentials: true});
  return data;
}