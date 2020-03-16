import axios from "axios";

import {} from "./types";

import { notify } from "./notify";

// Get all chatMessages
export const getCurrentValues = () => async dispatch => {
  try {
    const res = await axios.get(`http://localhost:3100/api/v1/users/`);

    dispatch({
      type: GET_FORM_VALUES,
      payload: res.data
    });
  } catch (err) {
    dispatch(
      notify(
        "error",
        "Could not fetch current user data. See console for error details"
      )
    );
  }
};

//TODO: VERIFY WORKING
export const updatePassword = () => async dispatch => {
  try {
    const res = await axios.patch(
      `http://localhost:3100/api/v1/users/updateMyPassword`
    );

    dispatch({
      type: UPDATE_PASSWORD,
      payload: res.data
    });
  } catch (err) {
   console.log(err);
    dispatch(
      notify("error", "Password update failed. See console for error details")
    );
};

export const updateField = field => async dispatch => {
  try {
    const res = await axios.patch(
      `http://localhost:3100/api/v1/users/updateMe`
    );

    if (field === "username") {
      // use an array and .includes??
      dispatch({
        type: UPDATE_USERNAME,
        payload: res.data
      });
    }

    if (field === "email") {
      dispatch({
        type: UPDATE_EMAIL,
        payload: res.data
      });
    }
  } catch (err) {
    console.log(err);
    dispatch(
      notify("error", "Could not update user information. See console for error details")
    );
  }
};

//TODO: VERIFY WORKING
export const deleteAccount = () => async dispatch => {
  try {
    const res = await axios.delete(
      `http://localhost:3100/api/v1/users/deleteMe`
    );

    //TODO: HANDLE ACCOUNT DELETION
    // set isAuthenticated to false on auth,
    // notify with snackbar on redirect to login screen...
    dispatch({
      type: ACCOUNT_DELETED,
      payload: res.data
    });
  } catch (err) {
    //TODO: HANDLE ERRORS
    // dispatch({
    //   type: POST_ERROR,
    //   payload: { msg: err.response.statusText, status: err.response.status }
    // });
  }
};
