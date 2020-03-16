import axios from "axios";
import {
  REGISTER_SUCCEEEDED,
  LOGIN_SUCCEEDED,
  LOGOUT_SUCCEEDED,
  ACCOUNT_UPDATED
} from "./types";
import { notify } from "./notify";

const localhost = "http://localhost:3100";
let url;

export const getUser = () => async dispatch => {
  url =
    process.env.NODE_ENV === "production"
      ? "/api/v1/users/logout"
      : `${localhost}/api/v1/users/logout`;

  try {
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.token}`
      }
    });

    dispatch({
      type: LOGIN_SUCCEEDED,
      payload: res.data.data.doc
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

export const login = (email, password) => async dispatch => {
  url =
    process.env.NODE_ENV === "production"
      ? "/api/v1/users/login"
      : `${localhost}/api/v1/users/login`;

  try {
    const res = await axios({
      method: "POST",
      url,
      withCredentials: true,
      data: {
        email,
        password
      }
    });

    // Save token in response to localStorage
    localStorage.setItem("token", res.data.token);

    dispatch({
      type: LOGIN_SUCCEEDED,
      payload: res.data.data.user
    });
  } catch (err) {
    console.log(err);
    dispatch(
      notify("error", "A login error occured. See console for error details")
    );
  }
};

export const logout = () => async dispatch => {
  try {
    url =
      process.env.NODE_ENV === "production"
        ? "/api/v1/users/logout"
        : `${localhost}/api/v1/users/logout`;

    const res = await axios.get(url);
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
  passwordConfirm
}) => async dispatch => {
  const body = { username, email, password, passwordConfirm };
  url =
    process.env.NODE_ENV === "production"
      ? "/api/v1/users/signup"
      : `${localhost}/api/v1/users/signup`;

  try {
    const res = await axios({
      method: "POST",
      url,
      data: body
    });

    dispatch({
      type: REGISTER_SUCCEEEDED,
      payload: res.data
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
export const updateSettings = (data, type) => async dispatch => {
  const endpoint = type === "password" ? "updateMyPassword" : "updateMe";

  url =
    process.env.NODE_ENV === "production"
      ? `/api/v1/users/${endpoint}`
      : `${localhost}/api/v1/users/${endpoint}`;

  try {
    const res = await axios({
      method: "PATCH",
      url,
      withCredentials: true,
      data
    });

    dispatch({
      type: ACCOUNT_UPDATED,
      payload: res.data.data.user
    });

    dispatch(
      notify(
        "success",
        `${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully`
      )
    );
  } catch (err) {
    console.log(err);
    dispatch(
      notify(
        "error",
        "An error occured during signup. ee console for error details"
      )
    );
  }
};

export const deleteAccount = formValues => async dispatch => {
  //   try {
  //     const res = await axios({
  //       method: "PATCH",
  //       url: "http://localhost:3100/api/v1/users/updateMyPassword",
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
