import axios from "axios";
import {
  GET_CHATROOMS,
  ADD_CHATROOM_SUCCEEDED,
  USER_JOINED_CHATROOM,
  MESSAGES_LOADED_ON_CHATROOM_JOIN,
  ADD_CHATROOM_DIALOG_OPENED,
  ADD_CHATROOM_DIALOG_CLOSED,
  RECEIVED_CURRENT_CHATROOM_USERS,
} from "./types";
import { notify } from "./notify";

//TODO: refactor for factory func style, see if you can use less/one listener for all.
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
    const res = await axios.get("/api/v1/chatrooms", {
      withCredentials: true,
    });

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

// TODO: Implement sending/adding addition details to chatrooms EX: images or descriptions
export const createChatroom = (chatroom) => async (dispatch) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/chatrooms",
      withCredentials: true,
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
    const res = await axios.get(`/api/v1/chatrooms/${chatroom.id}`, {
      withCredentials: true,
    });

    console.log("--------- JOIN POPULATE -----------", res.data.data.chatroom);

    //TODO: Fix DB handling - Remove currentChatroom on DB when user leaves room or disconnects
    // dispatch({
    //   type: RECEIVED_CURRENT_CHATROOM_USERS,
    //   payload: res.data.data.chatroom.activeUsers
    // });

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

    console.log("Emitted response", emitResponse);
    console.log("currentChatroom, grab the id", prevChatroom);

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

//TODO: Get and edit chatroom functions
// // Get current users chatroom
// export const getCurrentChatroom = () => async dispatch => {
//   try {
//     const res = await axios.get("/api/v1/chatroom");

//     dispatch({
//       type: GET_PROFILE,
//       payload: res.data
//     });
//   } catch (err) {
//     dispatch({
//       type: PROFILE_ERROR,
//       payload: { msg: err.response.statusText, status: err.response.status }
//     });
//   }
// };

// // Get profile by ID
// export const getChatroomById = userId => async dispatch => {
//   try {
//     const res = await axios.get(`/api/v1/chatroom/${Id}`);

//     dispatch({
//       type: GET_PROFILE,
//       payload: res.data
//     });
//   } catch (err) {
//     dispatch({
//       type: PROFILE_ERROR,
//       payload: { msg: err.response.statusText, status: err.response.status }
//     });
//   }
// };

// // Delete chatroom
// export const deleteChatroom = () => async dispatch => {
//   if (window.confirm("Are you sure? This can NOT be undone!")) {
//     try {
//       await axios.delete(`/api/v1/chatroom/${id}`);

//       dispatch({ type: CLEAR_PROFILE });
//       dispatch({ type: ACCOUNT_DELETED });

//       dispatch(setAlert("Your account has been permanantly deleted"));
//     } catch (err) {
//       dispatch({
//         type: PROFILE_ERROR,
//         payload: { msg: err.response.statusText, status: err.response.status }
//       });
//     }
//   }
// };
