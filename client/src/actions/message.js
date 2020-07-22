import axios from "axios";
import { emitSocketEvent } from "../socket-client/socketFunctions";
import { GET_MESSAGES } from "./types";
import { notify } from "./notify";

export const subscribeMessages = () => {
  return {
    event: "CHAT_MESSAGE_RECEIVED",
    handle: "CHAT_MESSAGE_RECEIVED",
  };
};

export const getMessages = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/v1/chatrooms/${id}/messages`);
    dispatch({
      type: GET_MESSAGES,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
    dispatch(
      notify("error", "Could not fetch messages. See console for error details")
    );
  }
};

export const sendMessage = (msgData) => async (dispatch) => {
  try {
    dispatch(emitSocketEvent("CHAT_MESSAGE_SENT", msgData));
  } catch (err) {
    console.log(err);
    dispatch(
      notify("error", "Could not send message. See console for error details")
    );
  }
};
