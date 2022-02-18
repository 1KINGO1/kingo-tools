import {createAction} from "@reduxjs/toolkit";

export interface Flag{
  title: string,
  color: string,
  id: number
}

export interface User {
  login: string,
  flags: Array<Flag>
}

export const setToken = createAction<string>("AUTH/SET_TOKEN");
export const removeToken = createAction("AUTH/REMOVE_TOKEN");
export const auth = createAction("AUTH/SET_AUTH");
export const removeAuth = createAction("AUTH/REMOVE_AUTH");
export const setData = createAction<User>("AUTH/SET_DATA");
