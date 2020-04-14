import axios from "axios";
import {
  REGISTER_SUCCEEEDED,
  LOGIN_SUCCEEDED,
  LOGOUT_SUCCEEDED,
  ACCOUNT_UPDATED,
} from "./types";
import { notify } from "./notify";

export const getUser = () => async (dispatch) => {
  console.log("FROM GETUSER", localStorage.token);
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
  } catch (err) {
    console.log(err);
    dispatch(
      notify(
        "error",
        "Could not re-authorize user. Please login again. See console for error details"
      )
    );
  }
};

export const login = (email, password) => async (dispatch) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/users/login",
      withCredentials: true,
      data: {
        email,
        password,
      },
    });

    // Save token in response to localStorage
    localStorage.setItem("token", res.data.token);

    dispatch({
      type: LOGIN_SUCCEEDED,
      payload: res.data.data.user,
    });
  } catch (err) {
    console.log(err);
    dispatch(
      notify("error", "A login error occured. See console for error details")
    );
  }
};

export const logout = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/v1/users/logout");
    if ((res.data.status = "success")) {
      dispatch({ type: LOGOUT_SUCCEEDED });
      dispatch(notify("success", "Logged out successfully"));
      localStorage.removeItem("token");
    }
  } catch (err) {
    console.log(err);
    dispatch(
      notify(
        "error",
        "Could not complete logout. See console for error details"
      )
    );
  }
};

export const register = ({
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

    console.log("RESPONSE FROM SIGNUP...", res.data);

    // Save token in response to localStorage
    localStorage.setItem("token", res.data.token);

    dispatch({
      type: REGISTER_SUCCEEEDED,
      payload: res.data.data.user,
    });

    dispatch(notify("success", "Account created successfully."));
  } catch (err) {
    console.log(err);
    dispatch(
      notify(
        "error",
        "An error occured during signup. See console for error details"
      )
    );
  }
};

// type is either 'password' or 'data'
export const updateUserData = (data, type) => async (dispatch) => {
  const endpoint = type === "password" ? "updateMyPassword" : "updateMe";
  console.log("PASSED IN DATA ----------", data);

  try {
    const res = await axios({
      method: "PATCH",
      url: `/api/v1/users/${endpoint}`,
      withCredentials: true,
      data,
    });

    console.log("RESPONSE FROM UPDATE USER CHATROOM", res.data);

    dispatch({
      type: ACCOUNT_UPDATED,
      payload: res.data.data.user,
    });

    if (type !== "chatroom") {
      dispatch(notify("success", "Data updated successfully"));
    }
  } catch (err) {
    console.log(err);
    dispatch(
      notify(
        "error",
        "An error occured while updating user data. See console for error details"
      )
    );
  }
};

export const deleteAccount = (formValues) => async (dispatch) => {
  //   try {
  //     const res = await axios({
  //       method: "PATCH",
  //       url: "/api/v1/users/updateMyPassword",
  //       data: formValues
  //     });
  //     // dispatch({
  //     //   type: PASSWORD_UPDATED,
  //     //   payload: res.data
  //     // });
  //   } catch (err) {
  //     const errors = err.response.data.errors;
  //     if (errors) {
  //       //   errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
  //       console.error(errors);
  //     }
  //     dispatch({
  //       type: REGISTER_FAILED
  //     });
  //   }
};
