import React, { useContext, useState } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";

import ProgressButton from "../../ProgressButton";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Typography, Container } from "@material-ui/core";

import InputAdornment from "@material-ui/core/InputAdornment";
import AccountCircle from "@material-ui/icons/AccountCircle";

import DialogTitle from "@material-ui/core/DialogTitle";

import { register } from "../../../actions/auth";

const useStyles = makeStyles((theme) => ({
  loginDialog: {
    padding: theme.spacing(3),
  },
  titleContainer: {
    padding: theme.spacing(3),
    paddingTop: "1.5em",
  },
}));

const RegisterForm = ({ register, isAuthenticated, handleNext }) => {
  const classes = useStyles();

  const [formValue, setFormValue] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const { username, email, password, passwordConfirm } = formValue;

  const onChange = (e) =>
    setFormValue({ ...formValue, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();

    register(formValue);
    handleNext();
    // if (value !== "") {
    // }
  };

  // if (isAuthenticated) {
  //   return handleNext();
  // }

  // if (isAuthenticated) {
  //   return <Redirect to="/" />;
  // }

  //Todo: Fix privateroutes, and any edited isAuthenticated Redirect code, so it works as before.
  // Getting unauthorized for some reason...
  //TODO: Fix photo upload functionality, so it correctly displays and processes the uploaded file
  //TODO: Verify where the file is being stored, and figure out best place to do this...
  //TODO: Fix stepper functionality: Make it so that you cannot get to next step unless register is successful.
  //TODO: Fix spacing and styling where needed.

  return (
    <>
      <Container className={classes.titleContainer}>
        <DialogTitle id="form-dialog-title">
          Register a MaterialChat account
        </DialogTitle>
        <Typography>
          Register an account to log in and begin chatting!
        </Typography>
        <Link to="/login">
          <Typography>Already have an account?</Typography>
        </Link>
      </Container>

      <form onSubmit={(e) => onSubmit(e)}>
        <TextField
          autoFocus
          fullWidth
          margin="dense"
          label="Username"
          name="username"
          variant="outlined"
          //TODO: fix error handling - error={error}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircle />
              </InputAdornment>
            ),
          }}
          placeholder="Enter username..."
          //TODO: fix error handling - helperText={error ? "Username is taken." : ""}
          value={username}
          onChange={(e) => {
            // if (error) {
            //   dispatch({ type: "LOGIN_ERROR_CLEARED" });
            // }
            onChange(e);
          }}
        />
        <TextField
          fullWidth
          margin="dense"
          name="email"
          type="email"
          label="Email"
          variant="outlined"
          //TODO: fix error handling - error={error}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircle />
              </InputAdornment>
            ),
          }}
          placeholder="Email"
          //TODO: fix error handling - helperText={error ? "Email is already registered." : ""}
          value={email}
          onChange={(e) => {
            onChange(e);
            //TODO: fix error handling -
            // if (error) {
            //   // dispatch({ type: "LOGIN_ERROR_CLEARED" });
            // }
          }}
        />
        <TextField
          fullWidth
          margin="dense"
          type="password"
          label="Password"
          name="password"
          variant="outlined"
          //TODO: fix error handling -  error={error}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircle />
              </InputAdornment>
            ),
          }}
          placeholder="Password"
          //TODO: fix error handling - helperText={error ? "Incorrect Password." : ""}
          value={password}
          onChange={(e) => {
            onChange(e);
            //TODO: fix error handling -
            // if (error) {
            //   // dispatch({ type: "LOGIN_ERROR_CLEARED" });
            // }
          }}
        />
        <TextField
          fullWidth
          margin="dense"
          type="password"
          label="Confirm Password"
          name="passwordConfirm"
          variant="outlined"
          //TODO: fix error handling -  error={error}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircle />
              </InputAdornment>
            ),
          }}
          placeholder="Confirm Password"
          //TODO: fix error handling - helperText={error ? "Incorrect Password." : ""}
          value={passwordConfirm}
          onChange={(e) => {
            onChange(e);
            //TODO: fix error handling -
            // if (error) {
            //   // dispatch({ type: "LOGIN_ERROR_CLEARED" });
            // }
          }}
        />

        <ProgressButton
          title="Sign Up"
          type="submit"
          color="primary"
          loading=""
        />
      </form>
    </>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { register })(RegisterForm);
