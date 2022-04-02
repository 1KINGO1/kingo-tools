import {createReducer} from "@reduxjs/toolkit";
import {removeGuild, setGuild, setGuildData} from "../actions/botActions";
import {Guild} from "../../types/Guild";

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
    }
});