import {configureStore} from "@reduxjs/toolkit";
import {authReducer} from "./reducers/AuthReducer";
import {DCBReducer} from "./reducers/DCBReducer";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dcb: DCBReducer
  }
})

export type RootState = ReturnType<typeof store.getState>;