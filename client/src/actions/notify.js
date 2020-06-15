import { v4 as uuidv4 } from "uuid";
import { SET_NOTIFICATION, REMOVE_NOTIFICATION, USER_TYPING } from "./types";

export const notify = (messageType, message, timeout = 5000) => (dispatch) => {
  //* types = error, warning, info, success

  const id = uuidv4();
  dispatch({
    type: SET_NOTIFICATION,
    payload: { messageType, message, id },
  });

  setTimeout(
    () => dispatch({ type: REMOVE_NOTIFICATION, payload: id }),
    timeout
  );
};

//* Typing events must be based on socket rooms - must be implemeted first.
export const subscribeTyping = () => {
  return {
    event: "TYPING",
    handle: USER_TYPING,
  };
};

export const emitTyping = (data) => {
  return {
    event: "TYPING",
    emit: true,
    payload: data,
  };
};
