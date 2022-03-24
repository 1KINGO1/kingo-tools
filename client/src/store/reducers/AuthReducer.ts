import {createReducer} from "@reduxjs/toolkit";
import {setData, removeToken, setToken, User, auth, removeAuth} from "../actions/authActions";

interface State{
  isAuth: boolean,
  token: null | string,
  user: User
}

const initialState = {
  isAuth: false,
  token: null,
  user: {
    login: "",
    flags: [],
    discord: {}
  }
}

export const authReducer = createReducer(initialState, {
  [setToken.type](state, action){
    state.token = action.payload;
  },
  [removeToken.type](state){
    state.token = null;
  },
  [setData.type](state, action){
    state.user = action.payload;
  },
  [auth.type](state){
    state.isAuth = true;
  },
  [removeAuth.type](state){
    state.isAuth = false;
  }
})