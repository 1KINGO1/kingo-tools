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

const rootReducer = combineReducers({
  auth: authReducer,
  dcb: DCBReducer
})

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ["isAuth", "token"]
}

const persistedReducerAuth = persistReducer(persistConfig, authReducer)

export const store = configureStore({
  reducer: {
    auth: persistedReducerAuth,
    dcb: DCBReducer
  },
  middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
});

export type RootState = ReturnType<typeof store.getState>;