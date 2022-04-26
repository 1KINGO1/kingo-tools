import {createAction} from "@reduxjs/toolkit";
import {Guild} from "../../types/Guild";
import {LevelSystemRole} from "../../types/LevelSystemRole";

export const setGuild = createAction<string>("BOT/SET_GUILD");
export const removeGuild = createAction("BOT/REMOVE_GUILD");
export const setGuildData = createAction<{guild: Guild, roles: {name: string, id: string, color: string}, channels: {name: string, id: string}}>("BOT/SET_GUILD_DATA");
export const addLevelsRule = createAction<LevelSystemRole>("BOT/ADD_RULE");
export const removeLevelsRule = createAction<string>("BOT/REMOVE_RULE");