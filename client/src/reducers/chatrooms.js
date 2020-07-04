import {
  GET_CHATROOMS,
  ADD_CHATROOM_SUCCEEDED,
  USER_JOINED_CHATROOM,
  SOCKET_ADDED_CHATROOM,
  ADD_CHATROOM_DIALOG_OPENED,
  ADD_CHATROOM_DIALOG_CLOSED,
  RECEIVED_CURRENT_CHATROOM_USERS,
} from "../actions/types";

const initState = {
  currentChatroom: localStorage.getItem("currentChatroom"),
  activeUsers: [],
  chatrooms: [],
  loading: true,
  // usersInChatroom: [],
  addChatroomDialog: {
    isOpen: false,
    //   error: false,
    //   success: false
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
    case ADD_CHATROOM_SUCCEEDED:
      return {
        ...state,
        loading: false,
        chatrooms: [...state.chatrooms, action.payload],
        addChatroomDialog: {
          isOpen: false,
        },
      };

    // case "DELETE_CHATROOM":
    //   return state.chatrooms.filter((chatroom) => chatroom === action.payload)

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

    case RECEIVED_CURRENT_CHATROOM_USERS:
      if (state.activeUsers.some((i) => i.id === action.payload.id)) {
        return state;
      } else if (action.payload.remove) {
        return {
          ...state,
          activeUsers: state.activeUsers.filter(
            (i) => i.id !== action.payload.user.id
          ),
        };
      } else
        return {
          ...state,
          activeUsers: [...state.activeUsers, action.payload],
        };

    default:
      return state;
  }
};
