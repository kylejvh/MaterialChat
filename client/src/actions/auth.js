import axios from "axios";
import {
  REGISTER_INITIAL_STEP_SUCCEEEDED,
  REGISTER_FINAL_STEP_SUCCEEEDED,
  LOGIN_SUCCEEDED,
  LOGOUT_SUCCEEDED,
  ACCOUNT_UPDATED,
} from "./types";
import { notify } from "./notify";

export const getUser = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/v1/users/me", {
      headers: {
        Authorization: `Bearer ${localStorage.token}`,
      },
    });

    dispatch({
      type: LOGIN_SUCCEEDED,
      payload: res.data.data.doc,
    });
  } catch (error) {
    const errorResponse =
      error.response.data.message || `An error occurred: ${error}`;
    console.log(errorResponse);
    dispatch(notify("error", errorResponse));
  }
};

export const login = (values) => async (dispatch) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/users/login",
      withCredentials: true,
      data: {
        email: values.email,
        password: values.password,
      },
    });

    // Save token in response to localStorage
    localStorage.setItem("token", res.data.token);

    dispatch({
      type: LOGIN_SUCCEEDED,
      payload: res.data.data.user,
    });
  } catch (error) {
    console.log(error.response.data.message || `An error occurred: ${error}`);
    dispatch(notify("error", error.response.data.message));
  }
};

export const logout = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/v1/users/logout");
    if (res.data.status === "success") {
      dispatch({ type: LOGOUT_SUCCEEDED });
      dispatch(notify("success", "Logged out successfully"));
      localStorage.removeItem("token");
    }
  } catch (error) {
    console.log(error.response.data.message || `An error occurred: ${error}`);
    dispatch(
      notify(
        "error",
        "Could not complete logout. See console for error details"
      )
    );
  }
};

export const registerAccount = ({
  username,
  email,
  password,
  passwordConfirm,
}) => async (dispatch) => {
  const body = { username, email, password, passwordConfirm };

  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/users/signup",
      data: body,
    });

    // Save token in response to localStorage
    localStorage.setItem("token", res.data.token);

    dispatch({
      type: REGISTER_INITIAL_STEP_SUCCEEEDED,
      payload: res.data,
    });

    dispatch(notify("success", "Account created successfully."));
  } catch (error) {
    console.log(error.response.data.message || `An error occurred: ${error}`);
    dispatch(notify("error", error.response.data.message));
  }
};

export const completeRegister = () => async (dispatch) => {
  dispatch({
    type: REGISTER_FINAL_STEP_SUCCEEEDED,
  });

  dispatch(notify("success", "Register complete. Welcome!"));
};

export const updateUserData = (data, callback = null) => async (dispatch) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: "/api/v1/users/updateMe",
      withCredentials: true,
      data,
    });
    console.log(data);
    dispatch({
      type: ACCOUNT_UPDATED,
      payload: res.data.data.user,
    });

    console.log(res);
    // Allow a callback to be attached and executed after data updates.
    if (res.data.status === "success" && callback) {
      return callback();
    } else if (data.type !== "chatroom" && res.data.status === "success") {
      console.log(data.type);
      dispatch(notify("success", "Data updated successfully"));
    }
  } catch (error) {
    console.log(error.response.data.message || `An error occurred: ${error}`);
    dispatch(notify("error", error.response.data.message));
  }
};

export const updatePassword = (data) => async (dispatch) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: "/api/v1/users/updateMyPassword",
      withCredentials: true,
      data: {
        passwordCurrent: data.passwordCurrent,
        newPassword: data.newPassword,
        newPasswordConfirm: data.newPasswordConfirm,
      },
    });

    if (res.data.status === "success") {
      dispatch(notify("success", "Password updated successfully"));
    }
    dispatch({
      type: ACCOUNT_UPDATED,
      payload: res.data.data.user,
    });
  } catch (error) {
    console.log(error);
    console.log(error.response.data.message || `An error occurred: ${error}`);
    dispatch(notify("error", error.response.data.message));
  }
};

export const deleteAccount = () => async (dispatch) => {
  try {
    const res = await axios.delete("/api/v1/users/deleteMe");
    // dispatch({
    //   type: DELETED,
    //   payload: res.data
    // });

    if (res.data.status === "success") {
      dispatch(notify("success", "Account deleted. Goodbye!"));
    }
  } catch (error) {
    console.log(error);
    console.log(error.response.data.message || `An error occurred: ${error}`);
    dispatch(notify("error", error.response.data.message));
  }
};
