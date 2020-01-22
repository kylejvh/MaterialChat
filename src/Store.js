import React from "react";
import io from "socket.io-client";

export const CTX = React.createContext();

const initState = {
  usersInChatroom: [],
  currentUser: {
    username: "", //! ADJUST FOR DEVELOPMENT
    currentChatroom: ""
  },
  chatrooms: {
    General: []
  },
  typing: {
    userTyping: "",
    isTyping: false
  },
  loginDialog: {
    isOpen: true,
    error: false,
    success: false
  },
  addChatroomDialog: {
    isOpen: false,
    error: false,
    success: false
  }
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCEEDED":
      return {
        ...state,
        loginDialog: {
          isOpen: false,
          success: true,
          error: false
        },
        currentUser: {
          ...state.currentUser,
          username: action.payload.username
        }
      };

    case "LOGIN_FAILED":
      return {
        ...state,
        loginDialog: {
          ...state.loginDialog,
          error: true,
          success: false
        }
      };

    // Clears error state when user types again after error.
    case "LOGIN_ERROR_CLEARED":
      return {
        ...state,
        loginDialog: {
          ...state.loginDialog,
          error: false
        }
      };

    case "USER_LOGGED_OUT":
      return {
        ...state,
        currentUser: {
          username: "",
          currentChatroom: ""
        },
        loginDialog: {
          ...state.loginDialog,
          isOpen: true,
          success: false
        }
      };

    // This reflects the action emitted to everyone online, e.g. showing new chatroom in list for everyone.
    case "NEW_CHATROOM_CREATED":
      return {
        ...state,
        chatrooms: {
          ...state.chatrooms,
          [action.payload.chatroomName]: []
        }
      };

    // This reflects the action emitted to just the user who created the chatroom, e.g. closing dialog.
    case "ADD_CHATROOM_SUCCEEDED":
      return {
        ...state,
        addChatroomDialog: {
          ...state.addChatroomDialog,
          isOpen: false,
          success: true
        }
      };

    case "ADD_CHATROOM_FAILED":
      return {
        ...state,
        addChatroomDialog: {
          ...state.addChatroomDialog,
          error: true
        }
      };

    // Clears error state when user types again after error.
    case "ADD_CHATROOM_ERROR_CLEARED":
      return {
        ...state,
        addChatroomDialog: {
          ...state.addChatroomDialog,
          error: false
        }
      };

    // Snackbar notification state
    case "ADD_CHATROOM_SUCCESS_EXPIRED":
      return {
        ...state,
        addChatroomDialog: {
          ...state.addChatroomDialog,
          success: false
        }
      };

    case "ADD_CHATROOM_DIALOG_OPENED":
      return {
        ...state,
        addChatroomDialog: {
          ...state.addChatroomDialog,
          isOpen: true
        }
      };

    case "ADD_CHATROOM_DIALOG_CLOSED":
      return {
        ...state,
        addChatroomDialog: {
          ...state.addChatroomDialog,
          isOpen: false
        }
      };

    case "JOIN_CHATROOM_SUCCEEDED":
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          currentChatroom: action.payload.chatroom
        }
      };

    case "RECEIVED_CURRENT_CHATROOM_USERS":
      return {
        ...state,
        usersInChatroom: action.payload
      };

    case "USER_STARTED_TYPING":
      return {
        ...state,
        typing: {
          userTyping: action.payload.userTyping,
          isTyping: action.payload.isTyping
        }
      };

    case "USER_STOPPED_TYPING":
      return {
        ...state,
        typing: {
          ...state.typing,
          userTyping: action.payload.userTyping,
          isTyping: action.payload.isTyping
        }
      };

    case "RECEIVED_MESSAGE":
      return {
        ...state,
        chatrooms: {
          ...state.chatrooms,
          [action.payload.chatroom]: [
            ...state.chatrooms[action.payload.chatroom],
            { from: action.payload.from, msg: action.payload.msg }
          ]
        }
      };

    default:
      return state;
  }
};

// Functions to emit requests to the server.
const sendChatAction = value => {
  socket.emit("chat message", value);
};

const requestUsername = value => {
  socket.emit("requestUsername", value);
};

const requestNewChatroom = value => {
  socket.emit("requestNewChatroom", value);
};

const requestJoinChatroom = value => {
  socket.emit("joinChatroom", value);
};

const handleTyping = value => {
  socket.emit("typing", value);
};

const handleStopTyping = value => {
  socket.emit("stopTyping", value);
};

const handleLogout = value => {
  socket.emit("userLogout", value);
};

let socket;

const Store = props => {
  const [state, dispatch] = React.useReducer(reducer, initState);

  //Socket.io Event Listeners - These were placed here to have a universal store - a place to listen for responses from the server, and send dispatches according the the response.
  if (!socket) {
    socket = io();

    socket.on("userSet", user => {
      dispatch({
        type: "LOGIN_SUCCEEDED",
        payload: user
      });
    });

    socket.on("userExists", () => {
      dispatch({ type: "LOGIN_FAILED" });
    });

    socket.on("chatroomExists", () => {
      dispatch({ type: "ADD_CHATROOM_FAILED" });
    });

    socket.on("chat message", msg => {
      dispatch({ type: "RECEIVED_MESSAGE", payload: msg });
    });

    socket.on("chatroomListUpdate", chatroom => {
      dispatch({ type: "NEW_CHATROOM_CREATED", payload: chatroom });
    });

    socket.on("newChatroomCreated", () => {
      dispatch({ type: "ADD_CHATROOM_SUCCEEDED" });
    });

    socket.on("currentChatroomUsers", users => {
      dispatch({ type: "RECEIVED_CURRENT_CHATROOM_USERS", payload: users });
    });

    socket.on("joinChatroomSuccess", data => {
      dispatch({ type: "JOIN_CHATROOM_SUCCEEDED", payload: data });
    });

    socket.on("notifyTyping", typingData => {
      dispatch({ type: "USER_STARTED_TYPING", payload: typingData });
    });

    socket.on("notifyStopTyping", typingData => {
      dispatch({ type: "USER_STOPPED_TYPING", payload: typingData });
    });

    socket.on("userLogoutSuccess", user => {
      dispatch({ type: "USER_LOGGED_OUT", payload: user });
    });
  }

  return (
    <CTX.Provider
      value={{
        state,
        dispatch,
        sendChatAction,
        requestUsername,
        requestNewChatroom,
        requestJoinChatroom,
        handleTyping,
        handleLogout,
        handleStopTyping
      }}
    >
      {props.children}
    </CTX.Provider>
  );
};

export default Store;
