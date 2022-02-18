import {createReducer} from "@reduxjs/toolkit";
import {removeToken, setBody, setEndPoint, setMethod, setResponse, setToken} from "../actions/dbcActions";

interface State{
  token: null | string,
  method: "get" | "post" | "put" | "patch" | null,
  body: object | null,
  endpoint: string,
  response: string
}

const initialState: State = {
  token: null,
  method: "get",
  body: null,
  endpoint: "channels/YOUR CHANNEL ID HERE/messages",
  response: ""
};

export const DCBReducer = createReducer(initialState, {
  [setToken.type](state, action){
    state.token = action.payload;
  },
  [removeToken.type](state){
    state.token = null;
  },
  [setBody.type](state, action){
    state.body = JSON.parse(action.payload);
  },
  [setEndPoint.type](state, action){
    state.endpoint = action.payload;
  },
  [setMethod.type](state, action){
    state.method = action.payload.toLowerCase();
  },
  [setResponse.type](state, action){
    state.response = action.payload;
  }
})