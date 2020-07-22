import {
  GET_CHATROOMS,
  USER_JOINED_CHATROOM,
  SOCKET_ADDED_CHATROOM,
  ADD_CHATROOM_DIALOG_OPENED,
  ADD_CHATROOM_DIALOG_CLOSED,
  RECEIVED_CURRENT_CHATROOM_USERS,
  DELETE_CHATROOM,
} from "../actions/types";

const initState = {
  currentChatroom: null,
  activeUsers: [],
  chatrooms: [],
  loading: true,
  addChatroomDialog: {
    isOpen: false,
  },
};

export default (state = initState, action) => {
  switch (action.type) {
    case GET_CHATROOMS:
      return {
        ...state,
        chatrooms: action.payload,
        loading: false,
      };

    case USER_JOINED_CHATROOM:
      return {
        ...state,
        currentChatroom: action.payload,
      };

    case SOCKET_ADDED_CHATROOM:
      return {
        ...state,
        loading: false,
        chatrooms: [...state.chatrooms, action.payload],
      };

    case ADD_CHATROOM_DIALOG_OPENED:
      return {
        ...state,
        addChatroomDialog: {
          isOpen: true,
        },
      };

    case ADD_CHATROOM_DIALOG_CLOSED:
      return {
        ...state,
        addChatroomDialog: {
          isOpen: false,
        },
      };

    case DELETE_CHATROOM:
      return {
        ...state,
        chatrooms: state.chatrooms.filter(
          (chatroom) => chatroom.id !== action.payload
        ),
        currentChatroom: null,
        activeUsers: [],
      };

    case RECEIVED_CURRENT_CHATROOM_USERS:
      console.log("FROM USERLIST", action.payload);
      return {
        ...state,
        activeUsers: action.payload,
      };
    // if (state.activeUsers.some((i) => i.id === action.payload.user.id)) {
    //   return state;
    // } else if (action.payload.remove) {
    //   return {
    //     ...state,
    //     activeUsers: state.activeUsers.filter(
    //       (i) => i.id !== action.payload.user.id
    //     ),
    //   };
    // } else
    //   return {
    //     ...state,
    //     activeUsers: [...state.activeUsers, action.payload.user],
    //   };

    default:
      return state;
  }
};
