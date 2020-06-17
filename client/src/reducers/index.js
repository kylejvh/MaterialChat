import { combineReducers } from "redux";
import { LOGOUT_SUCCEEDED } from "../actions/types";
import auth from "./auth";
import chatrooms from "./chatrooms";
import message from "./message";
import notify from "./notify";

const appReducer = combineReducers({
  auth,
  chatrooms,
  message,
  notify,
});

export default (state, action) => {
  if (action.type === LOGOUT_SUCCEEDED) {
    state = undefined;
  }

  return appReducer(state, action);
};
