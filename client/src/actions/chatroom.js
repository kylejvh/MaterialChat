import axios from "axios";
import {
  GET_CHATROOMS,
  ADD_CHATROOM_SUCCEEDED,
  USER_JOINED_CHATROOM,
  MESSAGES_LOADED_ON_CHATROOM_JOIN,
  ADD_CHATROOM_DIALOG_OPENED,
  ADD_CHATROOM_DIALOG_CLOSED,
} from "./types";
import { notify } from "./notify";

export const subscribeChatrooms = () => {
  return {
    event: "SOCKET_ADDED_CHATROOM",
    handle: "SOCKET_ADDED_CHATROOM",
  };
};

export const subscribeChatroomUsers = () => {
  return {
    event: "CHATROOM_USERLIST_UPDATED",
    handle: "RECEIVED_CURRENT_CHATROOM_USERS",
  };
};

const emitChatroom = (chatroom) => {
  return {
    event: "SOCKET_ADDED_CHATROOM",
    emit: true,
    payload: chatroom,
  };
};

// Use general Function for DRY
const emitEvent = (event, payload) => {
  return {
    event,
    emit: true,
    payload,
  };
};

// Get all chatrooms
export const getChatrooms = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/v1/chatrooms");

    dispatch({
      type: GET_CHATROOMS,
      payload: res.data.data.chatrooms,
    });
  } catch (err) {
    console.log(err);
    dispatch(
      notify("info", "Could not fetch chatrooms. See console for error details")
    );
  }
};

export const createChatroom = (chatroom) => async (dispatch) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/chatrooms",
      data: {
        name: chatroom,
      },
    });

    dispatch({
      type: ADD_CHATROOM_SUCCEEDED,
      payload: res.data.data.newDoc,
    });

    dispatch(notify("info", `"${res.data.data.newDoc.name}" created`));
    dispatch(emitChatroom(res.data.data.newDoc));
  } catch (err) {
    console.log(err);
    dispatch(
      notify(
        "error",
        `Could not create chatroom. See console for error details`
      )
    );
  }
};

// Fetches Chatroom info and messages
export const joinChatroom = (chatroom) => async (dispatch, getState) => {
  const prevChatroom = getState().chatrooms.currentChatroom;
  const user = {
    id: getState().auth.currentUser._id,
    username: getState().auth.currentUser.username,
  };

  // Getting info of specific chatoom
  try {
    const res = await axios.get(`/api/v1/chatrooms/${chatroom.id}`);

    dispatch({
      type: USER_JOINED_CHATROOM,
      payload: res.data.data.chatroom,
    });

    // If user is leaving a chatroom to join a new one, append previous chatroom id to emitted event.
    const emitResponse = prevChatroom
      ? {
          ...res.data.data.chatroom,
          user,
          prevChatroom: prevChatroom.id,
        }
      : { ...res.data.data.chatroom, user };

    dispatch(emitEvent("SOCKET_JOINED_CHATROOM", emitResponse));

    dispatch({
      type: MESSAGES_LOADED_ON_CHATROOM_JOIN,
      payload: res.data.data.chatroom.messages,
    });
  } catch (err) {
    console.log(err);
    dispatch(
      notify("error", "Could not join chatroom. See console for error details")
    );
  }
};

export const openDialog = () => {
  return { type: ADD_CHATROOM_DIALOG_OPENED };
};

export const closeDialog = () => {
  return { type: ADD_CHATROOM_DIALOG_CLOSED };
};
