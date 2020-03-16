import axios from "axios";
import {
  GET_CHATROOMS,
  ADD_CHATROOM_SUCCEEDED,
  USER_JOINED_CHATROOM,
  MESSAGES_LOADED_ON_CHATROOM_JOIN,
  ADD_CHATROOM_DIALOG_OPENED,
  ADD_CHATROOM_DIALOG_CLOSED
} from "./types";
import { notify } from "./notify";

const localhost = "http://localhost:3100";
let url;

export const subscribeChatrooms = () => {
  return {
    event: "SOCKET_ADDED_CHATROOM",
    handle: "SOCKET_ADDED_CHATROOM"
  };
};

const emitChatroom = chatroom => {
  return {
    event: "SOCKET_ADDED_CHATROOM",
    emit: true,
    payload: chatroom
  };
};

// Get all chatrooms
export const getChatrooms = () => async dispatch => {
  url =
    process.env.NODE_ENV === "production"
      ? "/api/v1/chatrooms"
      : `${localhost}/api/v1/chatrooms`;

  try {
    const res = await axios.get(url, {
      withCredentials: true
    });

    dispatch({
      type: GET_CHATROOMS,
      payload: res.data.data.chatrooms
    });
  } catch (err) {
    console.log(err);
    dispatch(
      notify("info", "Could not fetch chatrooms. See console for error details")
    );
  }
};

// TODO: Implement sending/adding addition details to chatrooms EX: images or descriptions
export const createChatroom = chatroom => async dispatch => {
  url =
    process.env.NODE_ENV === "production"
      ? "/api/v1/chatrooms"
      : `${localhost}/api/v1/chatrooms`;

  try {
    const res = await axios({
      method: "POST",
      url,
      withCredentials: true,
      data: {
        name: chatroom
      }
    });

    dispatch({
      type: ADD_CHATROOM_SUCCEEDED,
      payload: res.data.data.newDoc
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
export const joinChatroom = chatroom => async dispatch => {
  url =
    process.env.NODE_ENV === "production"
      ? `/api/v1/chatrooms/${chatroom.id}`
      : `${localhost}/api/v1/chatrooms/${chatroom.id}`;

  try {
    const res = await axios.get(url, {
      withCredentials: true
    });

    dispatch({
      type: USER_JOINED_CHATROOM,
      payload: res.data.data.chatroom
    });

    dispatch({
      type: MESSAGES_LOADED_ON_CHATROOM_JOIN,
      payload: res.data.data.chatroom.messages
    });

    //! SEND USER'S CURRENT CHATROOM TO DB???
    // dispatch({
    //   type: ADD_CHATROOM_SUCCEEDED,
    //   payload: res.data
    // });
    // if (!edit) {
    //   history.push("/dashboard");
    // }
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
