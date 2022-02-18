import React from "react";
import ReactDOM from "react-dom";
import {ThemeProvider} from "styled-components";
import {Provider} from "react-redux";
import {store} from "./store/store";

import {mainTheme} from "./styles/theme/MainTheme";

import {App} from "./App";
import {BrowserRouter} from "react-router-dom";

import "antd/dist/antd.css";
import "./styles/glob-style.scss";
import "./styles/null-style.scss";

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={mainTheme}>
      {/*Root app*/}
      <BrowserRouter>
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>

    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);