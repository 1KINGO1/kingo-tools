import {createAction} from "@reduxjs/toolkit";
import {Guild} from "../../types/Guild";

export const setGuild = createAction<string>("BOT/SET_GUILD");
export const removeGuild = createAction("BOT/REMOVE_GUILD");

export const setGuildData = createAction<Guild>("BOT/SET_GUILD_DATA");