import {createAction} from "@reduxjs/toolkit";

export const setGuild = createAction<string>("BOT/SET_GUILD");
export const removeGuild = createAction("BOT/REMOVE_GUILD");