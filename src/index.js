import React from "react";
import ReactDOM from "react-dom";

import AppContextProvider from "./AppContextProvider.js";
import App from "./App";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <AppContextProvider>
    <App />
  </AppContextProvider>,
  rootElement
);
