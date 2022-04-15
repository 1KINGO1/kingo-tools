import {createReducer} from "@reduxjs/toolkit";
import {addLevelsRule, removeGuild, removeLevelsRule, setGuild, setGuildData} from "../actions/botActions";
import {Guild} from "../../types/Guild";
import {LevelSystemRole} from "../../types/LevelSystemRole";

interface State{
    currentGuild: string,
    guildData: Guild | null
};

const initialState: State = {
    currentGuild: "",
    guildData: null
};

export const botReducer = createReducer(initialState, {
    [setGuild.type]: (state, action) => {
        state.currentGuild = action.payload;
    },
    [removeGuild.type]: (state) => {
        state.currentGuild = "";
    },
    [setGuildData.type]: (state, action) => {
        state.guildData = action.payload
    },
    [addLevelsRule.type]: (state, action) => {
        state.guildData?.options.levelSystem.levelRoles.push(action.payload);
    },
    [removeLevelsRule.type]: (state, action) => {
        let arr: LevelSystemRole[] = [];

        for (let rule of state.guildData?.options.levelSystem.levelRoles || []){
            if (action.payload === rule.roleId){
                continue;
            }
            arr.push(rule);
        }

       state.guildData!.options.levelSystem.levelRoles = arr
    }
});