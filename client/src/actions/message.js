import axios from "axios";
import {
  GET_MESSAGES,
  GET_MESSAGE,
  CHAT_MESSAGE_SENT,
  ADD_CHAT_MESSAGE,
  EDIT_CHAT_MESSAGE,
  DELETE_CHAT_MESSAGE
} from "./types";
import { notify } from "./notify";

const localhost = "http://localhost:3100";
let url;

export const subscribeMessages = () => {
  return {
    event: "CHAT_MESSAGE_RECEIVED",
    handle: "CHAT_MESSAGE_RECEIVED"
  };
};

export const emitMessage = msg => {
  return {
    event: CHAT_MESSAGE_SENT,
    emit: true,
    payload: msg
  };
};

export const getMessages = id => async dispatch => {
  url =
    process.env.NODE_ENV === "production"
      ? `/api/v1/chatrooms/${id}/messages`
      : `${localhost}/api/v1/chatrooms/${id}/messages`;

  try {
    const res = await axios.get(url);
    dispatch({
      type: GET_MESSAGES,
      payload: res.data
    });
  } catch (err) {
    console.log(err);
    dispatch(
      notify("error", "Could not fetch messages. See console for error details")
    );
  }
};

export const sendMessage = data => async (dispatch, getState) => {
  const chatroomID = getState().chatrooms.currentChatroom.id;
  url =
    process.env.NODE_ENV === "production"
      ? `/api/v1/chatrooms/${chatroomID}/messages`
      : `${localhost}/api/v1/chatrooms/${chatroomID}/messages`;

  try {
    const res = await axios({
      method: "POST",
      url,
      withCredentials: true,
      data: {
        message: data.message
      }
    });

    dispatch({
      type: CHAT_MESSAGE_SENT,
      payload: data
    });
  } catch (err) {
    console.log(err);
    dispatch(
      notify("error", "Could not send message. See console for error details")
    );
  }
};

//TODO : Implement removal/editing of messages
// Delete Chat Message
// export const deleteChatMessage = id => async dispatch => {
//   try {
//     await axios.delete(`/api/posts/${id}`);

//     dispatch({
//       type: DELETE_POST,
//       payload: id
//     });

//     dispatch(setAlert('Post Removed', 'success'));
//   } catch (err) {
//     dispatch({
//       type: POST_ERROR,
//       payload: { msg: err.response.statusText, status: err.response.status }
//     });
//   }
// };