import { combineReducers } from "redux";

import auth from "./auth";
import chatrooms from "./chatrooms";
import message from "./message";
import notify from "./notify";
// import post from "./post";

export default combineReducers({
  auth,
  chatrooms,
  message,
  notify
});
