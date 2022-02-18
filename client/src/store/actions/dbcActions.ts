import {createAction} from "@reduxjs/toolkit";

export const setToken = createAction<string>("DCB/SET_TOKEN");
export const removeToken = createAction("DCB/REMOVE_TOKEN");
export const setMethod = createAction<string>("DCB/SET_METHOD");
export const setBody = createAction<string>("DCB/SET_BODY");
export const setEndPoint = createAction<string>("DCB/SET_ENDPOINT");
export const setResponse = createAction<string>("DCB/SET_RESPONSE");