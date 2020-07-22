import axios from "axios";
import {
  GET_CHATROOMS,
  USER_JOINED_CHATROOM,
  MESSAGES_LOADING,
  MESSAGES_LOADED_ON_CHATROOM_JOIN,
  ADD_CHATROOM_DIALOG_OPENED,
  ADD_CHATROOM_DIALOG_CLOSED,
  DELETE_CHATROOM,
} from "./types";
import { notify } from "./notify";
import { emitSocketEvent } from "../socket-client/socketFunctions";

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

export const createChatroom = (chatroomName) => async (dispatch) => {
  dispatch({
    type: ADD_CHATROOM_DIALOG_CLOSED,
  });

  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/chatrooms",
      data: {
        name: chatroomName,
      },
    });

    dispatch(notify("info", `"${res.data.data.newDoc.name}" created`));
    dispatch(emitSocketEvent("SOCKET_ADDED_CHATROOM", res.data.data.newDoc));
  } catch (error) {
    console.log(error);
    dispatch(
      notify(
        "error",
        `Could not create chatroom. ${error.response.data.message}`
      )
    );

    dispatch({
      type: ADD_CHATROOM_DIALOG_OPENED,
    });
  }
};

export const joinChatroom = ({
  newChatroom,
  prevChatroomId = null,
  userId,
}) => async (dispatch) => {
  // return {
  //   type: USER_JOINED_CHATROOM,
  //   payload: chatroom,
  // };

  dispatch({
    type: USER_JOINED_CHATROOM,
    payload: newChatroom,
  });

  dispatch(
    emitSocketEvent("CHATROOM_JOINED", {
      newChatroomId: newChatroom.id,
      ...(prevChatroomId && { prevChatroomId }),
      userId,
    })
  );

  dispatch(getChatroomData(newChatroom.id));
};

// Fetches Chatroom info and recent chat history
const getChatroomData = (id) => async (dispatch) => {
  dispatch({ type: MESSAGES_LOADING });
  try {
    const res = await axios.get(`/api/v1/chatrooms/${id}`);

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

export const deleteChatroom = (id, callback = null) => async (dispatch) => {
  try {
    await axios.delete(`/api/v1/chatrooms/${id}`);
    dispatch(emitSocketEvent("CHATROOM_DELETED", id));

    dispatch({
      type: DELETE_CHATROOM,
      payload: id,
    });

    callback && callback();
    dispatch(notify("success", "Chatroom successfully deleted."));
  } catch (err) {
    console.log(err);
    dispatch(notify("error", "Could not delete chatroom."));
  }
};

export const openDialog = () => {
  return { type: ADD_CHATROOM_DIALOG_OPENED };
};

export const closeDialog = () => {
  return { type: ADD_CHATROOM_DIALOG_CLOSED };
};
