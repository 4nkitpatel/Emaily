import "materialize-css/dist/css/materialize.min.css"; // one time import from our nodemodule so we can use it anywhere and we didnt provide from bcz we dont want any ref just we want to load css first thats why in this file we did it
// we didnt do "./materialize-css... " we did directly "materialize-css/..." when webpack see direct like this it look up that folder in node modules

import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import App from "./components/App";
import reducers from "./reducers";

import axios from "axios";
window.axios = axios;

const store = createStore(reducers, {}, applyMiddleware(thunk));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector("#root")
);
