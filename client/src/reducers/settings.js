import axios from "axios";

import {
  GET_FORM_VALUES,
  CHANGE_USERNAME,
  CHANGE_EMAIL,
  CHANGE_PASSWORD,
  CHANGE_AVATAR_IMAGE
} from "../actions/types";

const initState = {
  currentUsername: "",
  currentEmail: "",
  currentAvatar: "",
  loading: true
};

export default (state = initState, action) => {
  switch (action.type) {
    case FETCH_FORM_VALUES:
      return {
        ...state,
        currentUsername: "",
        currentEmail: "",
        currentUsername: "",
        currentAvatar: "",
        loading: false
      };

    case CHANGE_USERNAME:
      return {
        ...state,
        chatrooms: action.payload,
        loading: false
      };

    default:
      return state;
  }
};
