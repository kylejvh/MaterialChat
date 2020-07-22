import axios from "axios";
import {
  REGISTER_INITIAL_STEP_SUCCEEEDED,
  REGISTER_FINAL_STEP_SUCCEEEDED,
  LOGIN_SUCCEEDED,
  LOGOUT_SUCCEEDED,
  ACCOUNT_UPDATED,
} from "./types";
import { notify } from "./notify";
import { emitSocketEvent } from "../socket-client/socketFunctions";

export const getUser = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/v1/users/queryMe");

    if (res.status !== 204 && res.data) {
      const { doc: user } = res.data.data;

      dispatch(emitSocketEvent("USER_LOGGED_IN", user._id));

      dispatch({
        type: LOGIN_SUCCEEDED,
        payload: user,
      });
    }
  } catch (error) {
    const errorResponse =
      error?.response?.data?.message || `An error occurred: ${error}`;
    console.log(errorResponse);
    dispatch(notify("error", errorResponse));
  }
};

export const login = (values) => async (dispatch) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/users/login",
      data: {
        email: values.email,
        password: values.password,
      },
    });

    dispatch(emitSocketEvent("USER_LOGGED_IN", res.data.data.user._id));

    dispatch({
      type: LOGIN_SUCCEEDED,
      payload: res.data.data.user,
    });
  } catch (error) {
    console.log(error.response.data.message || `An error occurred: ${error}`);
    dispatch(notify("error", error.response.data.message));
  }
};

export const logout = (chatroomId = null, userId) => async (dispatch) => {
  try {
    const res = await axios.get("/api/v1/users/logout");
    if (res.data.status === "success") {
      dispatch({ type: LOGOUT_SUCCEEDED });

      dispatch(
        emitSocketEvent("LOGOUT", {
          ...(chatroomId && { chatroomId }),
          userId,
        })
      );

      dispatch(notify("success", "Logged out successfully"));
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

    dispatch({
      type: REGISTER_INITIAL_STEP_SUCCEEEDED,
      payload: res.data,
    });

    dispatch(emitSocketEvent("USER_LOGGED_IN", res.data.data.user._id));

    dispatch(notify("success", "Account created successfully."));
  } catch (error) {
    console.log(error.response.data.message || `An error occurred: ${error}`);
    dispatch(notify("error", error.response.data.message));
  }
};

export const completeRegister = ({ isGuest = null }) => async (dispatch) => {
  dispatch({
    type: REGISTER_FINAL_STEP_SUCCEEEDED,
  });

  const registerMessage = isGuest
    ? "Temporary guest account created successfully."
    : "Register complete. Welcome!";

  dispatch(notify("success", registerMessage));
};

export const updateUserData = (data, callback = null) => async (dispatch) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: "/api/v1/users/updateMe",
      data,
    });

    dispatch({
      type: ACCOUNT_UPDATED,
      payload: res.data.data.user,
    });

    // Allow a callback to be attached and executed after data updates.
    if (res.data.status === "success" && callback) {
      return callback();
    } else if (data.type !== "chatroom" && res.data.status === "success") {
      dispatch(notify("success", "Data updated successfully"));
    }
  } catch (error) {
    console.log(error.response.data.message || `An error occurred: ${error}`);
    dispatch(notify("error", error.response.data.message));
  }
};

export const registerGuestAccount = () => async (dispatch) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/users/signupGuest",
    });

    dispatch(completeRegister({ isGuest: true }));

    dispatch({
      type: REGISTER_INITIAL_STEP_SUCCEEEDED,
      payload: res.data,
    });

    dispatch(emitSocketEvent("USER_LOGGED_IN", res.data.data.user._id));
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

export const sendForgotPassword = (data) => async (dispatch) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/users/forgotPassword",
      data,
    });

    if (res.data.status === "success") {
      dispatch(
        notify(
          "success",
          "Password reset email sent. Please check your inbox or spam folder.",
          10000
        )
      );
    }
  } catch (error) {
    console.log(error);
    console.log(error.response.data.message || `An error occurred: ${error}`);
    dispatch(notify("error", error.response.data.message));
  }
};

export const changeForgottenPassword = (
  { password, passwordConfirm, token },
  callback = null
) => async (dispatch) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: `/api/v1/users/resetPassword/${token}`,
      data: {
        password,
        passwordConfirm,
      },
    });

    if (res.data.status === "success") {
      dispatch(notify("success", "Password change and login successful."));
      dispatch({
        type: LOGIN_SUCCEEDED,
        payload: res.data.data.user,
      });
      callback();
    }
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
