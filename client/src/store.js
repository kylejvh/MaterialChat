import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import socketMiddleware from "./socket-client/socketMiddleware";
import rootReducer from "./reducers";

const middleware = [thunk, socketMiddleware()];

export const store = createStore(
  rootReducer,
  {},
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
