// import {
//   REGISTER_SUCCESS,
//   //REGISTER_FAIL,
//   USER_LOADED,
//   //AUTH_ERROR,
//   LOGIN_SUCCESS,
//   //LOGIN_FAIL,
//   LOGOUT,
//   ACCOUNT_DELETED
// } from "../actions/types";

//! Brad auth code
//   const initialState = {
//     token: localStorage.getItem('token'),
//     isAuthenticated: null,
//     loading: true,
//     user: null
//   };

//   export default function(state = initialState, action) {
//     const { type, payload } = action;

//     switch (type) {
//       case USER_LOADED:
//         return {
//           ...state,
//           isAuthenticated: true,
//           loading: false,
//           user: payload
//         };
//       case REGISTER_SUCCESS:
//         return {
//           ...state,
//           ...payload,
//           isAuthenticated: true,
//           loading: false
//         };
//       case LOGIN_SUCCESS:
//         return {
//           ...state,
//           ...payload,
//           isAuthenticated: true,
//           loading: false
//         };
//       case ACCOUNT_DELETED:
//         return {
//           ...state,
//           token: null,
//           isAuthenticated: false,
//           loading: false,
//           user: null
//         };
//       case LOGOUT:
//         return {
//           ...state,
//           token: null,
//           isAuthenticated: false,
//           loading: false,
//           user: null
//         };
//       default:
//         return state;
//     }
//   }

//! MINE

import {
  REGISTER_SUCCEEEDED,
  REGISTER_FAILED,
  LOGIN_SUCCEEDED,
  LOGIN_FAILED,
  LOGOUT_SUCCEEDED,
  LOGOUT_FAILED,
  USER_LOADED,
  ACCOUNT_UPDATED,
  USER_TYPING,
  USER_STOPPED_TYPING
} from "../actions/types";

const initState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  currentUser: null,
  loading: false,
  success: false
  // typing: {
  //   userTyping: "",
  //   isTyping: false
  // },
  // loginDialog: {
  //   isOpen: false,
  //   error: false,
  //   success: false
  // }
};

export default (state = initState, action) => {
  switch (action.type) {
    case ACCOUNT_UPDATED:
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        loginDialog: {
          isOpen: false,
          success: true,
          error: false
        },
        currentUser: action.payload
      };

    case LOGIN_SUCCEEDED:
      return {
        ...state,
        isAuthenticated: true,
        loginDialog: {
          isOpen: false,
          success: true,
          error: false
        },
        currentUser: action.payload
      };

    case LOGIN_FAILED:
      return {
        ...state,
        loginDialog: {
          ...state.loginDialog,
          error: true,
          success: false
        }
      };

    case LOGOUT_SUCCEEDED:
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        currentUser: null,
        loading: false
      };

    case REGISTER_SUCCEEEDED:
      return {
        ...state,
        isAuthenticated: true,
        currentUser: action.payload
        // loginDialog: {
        //   ...state.loginDialog,
        //   isOpen: true,
        //   success: false
        // }
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

    default:
      return state;
  }
};
