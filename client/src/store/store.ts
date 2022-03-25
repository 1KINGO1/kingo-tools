import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {authReducer} from "./reducers/AuthReducer";
import {DCBReducer} from "./reducers/DCBReducer";

import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER, persistCombineReducers,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import {botReducer} from "./reducers/BotReducer";

const persistConfigAuth = {
  key: 'auth',
  storage,
  whitelist: ["isAuth", "token"]
};
const persistConfigBot = {
  key: 'bot',
  storage,
  whitelist: ["currentGuild"]
};

const persistedReducerAuth = persistReducer(persistConfigAuth, authReducer);
const persistedReducerBot = persistReducer(persistConfigBot, botReducer);


export const store = configureStore({
  reducer: {
    auth: persistedReducerAuth,
    dcb: DCBReducer,
    bot: botReducer
  },
  middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
});

export type RootState = ReturnType<typeof store.getState>;