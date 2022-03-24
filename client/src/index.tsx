import React from "react";
import ReactDOM from "react-dom";
import {ThemeProvider} from "styled-components";
import {Provider} from "react-redux";
import {store} from "./store/store";
import {PersistGate} from 'redux-persist/integration/react'

import {mainTheme} from "./styles/theme/MainTheme";

import {App} from "./App";
import {BrowserRouter} from "react-router-dom";

import "antd/dist/antd.css";
import "./styles/glob-style.scss";
import "./styles/null-style.scss";
import {persistStore} from "redux-persist";

ReactDOM.render(
    <React.StrictMode>
        <ThemeProvider theme={mainTheme}>
            {/*Root app*/}
            <BrowserRouter>
                <Provider store={store}>
                    <PersistGate persistor={persistStore(store)}>
                        <App/>
                    </PersistGate>
                </Provider>
            </BrowserRouter>

        </ThemeProvider>
    </React.StrictMode>,
    document.getElementById('root')
);