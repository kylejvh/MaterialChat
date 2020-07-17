import axios from "axios";
import { GET_MESSAGES, CHAT_MESSAGE_SENT } from "./types";
import { notify } from "./notify";

export const subscribeMessages = () => {
  return {
    event: "CHAT_MESSAGE_RECEIVED",
    handle: "CHAT_MESSAGE_RECEIVED",
  };
};

const emitMessage = (msg) => {
  console.log("LOOKING FOR EMIT", msg);
  return {
    event: "CHAT_MESSAGE_SENT",
    emit: true,
    payload: msg,
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

export const sendMessage = (data) => async (dispatch) => {
  // Emit socket message first, then post message to DB.
  dispatch(emitMessage(data));

  try {
    const res = await axios({
      method: "POST",
      url: `/api/v1/chatrooms/${data.sentInChatroom}/messages`,
      data: {
        message: data.message,
      },
    });

    dispatch({
      type: CHAT_MESSAGE_SENT,
      payload: data,
    });
  } catch (err) {
    console.log(err);
    dispatch(
      notify("error", "Could not send message. See console for error details")
    );
  }
};
