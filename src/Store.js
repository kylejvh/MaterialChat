import React from "react";
import io from "socket.io-client";

// context provider that holds all chats in state
// what is context? learn about this.

// Look into a better way to handle state,
// rather than using this higher order component

export const CTX = React.createContext();

const initState = {
  usersInChatroom: [],
  currentUser: {
    username: "", //! SET FOR DEVELOPMENT
    currentChatroom: ""
  },
  chatrooms: {
    general: []
  },
  loginDialog: {
    //! This is causing problems. Hacky solution! trigger ui transition. State is getting messy.
    displayLoginDialog: true, //! set false for development
    displayLoginError: false
  },
  typing: {
    userTyping: "",
    isTyping: false
  }
};

const reducer = (state, action) => {
  const { from, msg, chatroom } = action.payload;
  switch (action.type) {
    case "USER_LOGIN_SUCCESS":
      return {
        ...state,
        currentUser: {
          username: action.payload.username,
          currentChatroom: ""
        },
        loginDialog: { displayLoginDialog: false }
      };

    case "USER_LOGIN_FAIL":
      return {
        ...state,
        displayLoginError: true
      };

    case "USER_LOGOUT":
      return {
        ...state,
        currentUser: {
          username: "",
          currentChatroom: ""
        },
        loginDialog: { displayLoginDialog: true }
      };

    case "CREATE_CHATROOM":
      return {
        ...state,
        chatrooms: {
          ...state.chatrooms,
          [action.payload.chatroomName]: []
        }
      };

    case "JOIN_CHATROOM_SUCCESS":
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          currentChatroom: action.payload.chatroom
        }
      };

    case "RECEIVE_CURRENT_CHATROOM_USERS":
      return {
        ...state,
        usersInChatroom: action.payload
      };

    case "USER_TYPING":
      return {
        ...state,
        typing: {
          userTyping: action.payload.userTyping,
          isTyping: action.payload.isTyping
        }
      };

    case "USER_STOP_TYPING":
      return {
        ...state,
        typing: {
          ...state.typing,
          userTyping: action.payload.userTyping,
          isTyping: action.payload.isTyping
        }
      };

    case "RECEIVE_MESSAGE":
      return {
        ...state,
        chatrooms: {
          ...state.chatrooms,
          [chatroom]: [...state.chatrooms[chatroom], { from, msg }]
        }
      };

    default:
      return state;
  }
};

const sendChatAction = value => {
  socket.emit("chat message", value);
  console.log("correct message?", value);
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

// socket.on("notifyTyping", data  =>  {
// typing.innerText  =  data.user  +  "  "  +  data.message;
// console.log(data.user  +  data.message);
// });
// //stop typing
// messageInput.addEventListener("keyup", () =>  {
// socket.emit("stopTyping", "");
// });
// socket.on("notifyStopTyping", () =>  {
// typing.innerText  =  "";

// });

let socket;

const Store = props => {
  const [chatAppState, dispatch] = React.useReducer(reducer, initState);

  if (!socket) {
    socket = io(":3001");

    socket.on("userSet", user => {
      dispatch({
        type: "USER_LOGIN_SUCCESS",
        payload: user
      });
    });

    socket.on("userExists", function(user) {
      console.log("user already exists bro", user);
      dispatch({ type: "USER_LOGIN_FAIL", payload: user });
    });

    socket.on("chat message", function(msg) {
      dispatch({ type: "RECEIVE_MESSAGE", payload: msg });
    });

    socket.on("createChatroom", function(chatroom) {
      dispatch({ type: "CREATE_CHATROOM", payload: chatroom });
    });

    socket.on("currentChatroomUsers", function(users) {
      dispatch({ type: "RECEIVE_CURRENT_CHATROOM_USERS", payload: users });
    });

    socket.on("joinChatroomSuccess", data => {
      dispatch({ type: "JOIN_CHATROOM_SUCCESS", payload: data });
    });

    socket.on("notifyTyping", function(typingData) {
      dispatch({ type: "USER_TYPING", payload: typingData });
      console.log(typingData, "THIS IS TYPING DATA on START");
      // add payload...
      //! Clean this up. pass along just user, or message "${user} is typing"??
    });

    socket.on("notifyStopTyping", function(typingData) {
      dispatch({ type: "USER_STOP_TYPING", payload: typingData });
      console.log(typingData, "THIS IS TYPING DATA on STOP");
    });

    socket.on("userLogoutSuccess", user => {
      dispatch({ type: "USER_LOGOUT", payload: user });
    });
  }

  //! Goal: on userSet, correctly pass state back to dashboard and allow user into app. On userexists, deny user access.

  // Extract to userSelect component when it's working as intended.
  // const UserSelect = (userName, callback) => {
  //   const [userId, setUserId] = useLocalStorage("id", "");
  //   //! Not sure where below code belongs yet.
  //   useEffect(() => {
  //     if (userId !== "") {
  //       socket.emit("join", userId, room);
  //     }
  //     return {}
  //   });

  // we want to have functionality to set the user, assign that user an id?, and then pass it to dashboard.

  return (
    <CTX.Provider
      value={{
        chatAppState,
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
