import {
  MESSAGES_LOADED_ON_CHATROOM_JOIN,
  MESSAGES_LOADING,
  CHAT_MESSAGE_RECEIVED,
} from "../actions/types";

const initState = {
  messages: [],
  loading: true,
};

export default (state = initState, action) => {
  switch (action.type) {
    case MESSAGES_LOADING:
      return {
        ...state,
        messages: [],
        loading: true,
      };

    case MESSAGES_LOADED_ON_CHATROOM_JOIN:
      return {
        ...state,
        messages: action.payload,
        loading: false,
      };

    case CHAT_MESSAGE_RECEIVED:
      return {
        ...state,
        messages: [...state.messages, action.payload],
        loading: false,
      };

    default:
      return state;
  }
};
