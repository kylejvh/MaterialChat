import {
  SET_NOTIFICATION,
  REMOVE_NOTIFICATION,
  USER_TYPING,
} from "../actions/types";

const initState = {
  notifications: [],
  usersTyping: [],
};

export default (state = initState, action) => {
  switch (action.type) {
    case SET_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };

    case REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(
          (msg) => msg.id !== action.payload
        ),
      };

    case USER_TYPING:
      if (
        action.payload.typing &&
        state.usersTyping.includes(action.payload.user)
      ) {
        return state;
      } else if (action.payload.typing) {
        return {
          ...state,
          usersTyping: [...state.usersTyping, action.payload.user],
        };
      } else {
        return {
          ...state,
          usersTyping: state.usersTyping.filter(
            (i) => i !== action.payload.user
          ),
        };
      }

    default:
      return state;
  }
};
