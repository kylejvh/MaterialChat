import {
  GET_CHATROOMS,
  REQUEST_NEW_CHATROOM,
  ADD_CHATROOM_SUCCEEDED,
  ADD_CHATROOM_FAILED,
  USER_JOINED_CHATROOM,
  USER_LEFT_CHATROOM,
  SOCKET_ADDED_CHATROOM,
  ADD_CHATROOM_DIALOG_OPENED,
  ADD_CHATROOM_DIALOG_CLOSED,
  JOIN_CHATROOM_SUCCEEDED,
  RECEIVED_CURRENT_CHATROOM_USERS
} from "../actions/types";

const initState = {
  currentChatroom: null,
  chatrooms: [],
  loading: true,
  error: {},
  // usersInChatroom: [],
  addChatroomDialog: {
    isOpen: false
    //   error: false,
    //   success: false
  }
};

export default (state = initState, action) => {
  switch (action.type) {
    case GET_CHATROOMS:
      return {
        ...state,
        chatrooms: action.payload,
        loading: false
      };

    case USER_JOINED_CHATROOM:
      return {
        ...state,
        currentChatroom: action.payload
      };

    //TODO: Implement LOADING NOTIFICATION - PROBABLY JUST MAKE A GLOBAL UTIL FOR THIS!!!
    // This reflects the action emitted to everyone online, e.g. showing new chatroom in list for everyone.
    case REQUEST_NEW_CHATROOM:
      return {
        ...state
      };

    //TODO: HAVE THIS REDIRECT YOU TO A NEW PAGE, RATHER THAN A POP UP DIALOG???
    // This reflects the action emitted to just the user who created the chatroom, e.g. closing dialog.
    case SOCKET_ADDED_CHATROOM:
    case ADD_CHATROOM_SUCCEEDED:
      return {
        ...state,
        loading: false,
        chatrooms: [...state.chatrooms, action.payload],
        addChatroomDialog: {
          isOpen: false
        }
      };

    case ADD_CHATROOM_DIALOG_OPENED:
      return {
        ...state,
        addChatroomDialog: {
          isOpen: true
        }
      };

    case ADD_CHATROOM_DIALOG_CLOSED:
      return {
        ...state,
        addChatroomDialog: {
          isOpen: false
        }
      };

    case RECEIVED_CURRENT_CHATROOM_USERS:
      return {
        ...state,
        usersInChatroom: action.payload
      };

    default:
      return state;
  }
};
