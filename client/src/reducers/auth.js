import {
  REGISTER_INITIAL_STEP_SUCCEEEDED,
  REGISTER_FINAL_STEP_SUCCEEEDED,
  LOGIN_SUCCEEDED,
  ACCOUNT_UPDATED,
} from "../actions/types";

const initState = {
  isAuthenticated: null,
  currentUser: null,
  loading: false,
};

export default (state = initState, action) => {
  switch (action.type) {
    case ACCOUNT_UPDATED:
      return {
        ...state,
        currentUser: action.payload,
      };

    case LOGIN_SUCCEEDED:
      return {
        ...state,
        isAuthenticated: true,
        currentUser: action.payload,
      };

    case REGISTER_INITIAL_STEP_SUCCEEEDED:
      return {
        ...state,
        currentUser: action.payload.data.user,
      };

    case REGISTER_FINAL_STEP_SUCCEEEDED:
      return {
        ...state,
        isAuthenticated: true,
      };

    default:
      return state;
  }
};
