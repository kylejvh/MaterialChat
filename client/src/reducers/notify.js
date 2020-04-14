import {
  SET_NOTIFICATION,
  REMOVE_NOTIFICATION,
  USER_TYPING
} from "../actions/types";

const initState = {
  type: null,
  message: "",
  isActive: false,
  usersTyping: []
};

export default (state = initState, action) => {
  switch (action.type) {
    case SET_NOTIFICATION:
      const { type, message } = action.payload;
      return {
        ...state,
        type,
        message,
        isActive: true
      };

    case REMOVE_NOTIFICATION:
      return {
        ...state,
        isActive: false
      };

    case USER_TYPING:
      console.log(state.usersTyping);
      if (
        action.payload.typing &&
        state.usersTyping.includes(action.payload.user)
      ) {
        return state;
      } else if (action.payload.typing) {
        return {
          ...state,
          usersTyping: [...state.usersTyping, action.payload.user]
        };
      } else {
        return {
          ...state,
          usersTyping: state.usersTyping.filter(i => i !== action.payload.user)
        };
      }

    default:
      return state;
  }
};
