import {createReducer} from "@reduxjs/toolkit";
import {removeGuild, setGuild} from "../actions/botActions";

interface State{
    currentGuild: string
};

const initialState: State = {
    currentGuild: ""
};

export const botReducer = createReducer(initialState, {
    [setGuild.type]: (state, action) => {
        state.currentGuild = action.payload;
    },
    [removeGuild.type]: (state) => {
        state.currentGuild = "";
    }
});