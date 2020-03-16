import { SET_NOTIFICATION, REMOVE_NOTIFICATION, USER_TYPING } from "./types";

export const notify = (type, message, timeout = 5000) => async dispatch => {
  //* types = error, warning, info, success

  dispatch({
    type: SET_NOTIFICATION,
    payload: { type, message }
  });

  setTimeout(() => dispatch({ type: REMOVE_NOTIFICATION }), timeout);
};

//* Typing events must be based on socket rooms - must be implemeted first.
export const subscribeTyping = () => {
  return {
    event: "TYPING",
    handle: USER_TYPING
  };
};

export const emitTyping = data => {
  return {
    event: "TYPING",
    emit: true,
    payload: data
  };
};
