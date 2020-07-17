import axios from "axios";
import {
  GET_CHATROOMS,
  ADD_CHATROOM_SUCCEEDED,
  USER_JOINED_CHATROOM,
  MESSAGES_LOADED_ON_CHATROOM_JOIN,
  ADD_CHATROOM_DIALOG_OPENED,
  ADD_CHATROOM_DIALOG_CLOSED,
  DELETE_CHATROOM,
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
  dispatch({
    type: ADD_CHATROOM_DIALOG_CLOSED,
  });

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
  prevChatroom = null,
  user,
}) => async (dispatch) => {
  console.log("ATTEMPTED TO JOIN", newChatroom);
  console.log("PREV CHATROOM is =>", prevChatroom);
  // return {
  //   type: USER_JOINED_CHATROOM,
  //   payload: chatroom,
  // };

  dispatch({
    type: USER_JOINED_CHATROOM,
    payload: newChatroom,
  });

  // Should strictly handle socket joining socket.io room, so that all sockets can be aware of new user.
  dispatch(
    emitEvent("CHATROOM_JOINED", {
      newChatroomId: newChatroom.id,
      ...(prevChatroom && { prevChatroomId: prevChatroom.id }),
      user,
    })
  );

  getChatroomData(newChatroom.id);
};
// Fetches Chatroom info and messages
const getChatroomData = (id) => async (dispatch) => {
  // const prevChatroom = getState().chatrooms.currentChatroom;
  // const user = {
  //   id: getState().auth.currentUser._id,
  //   username: getState().auth.currentUser.username,
  // };

  // Getting info of specific chatoom
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
    const res = await axios.delete(`/api/v1/chatrooms/${id}`);

    console.log("RESPONSE FROM DELETE", res);

    dispatch(emitEvent("CHATROOM_DELETED", id));

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
