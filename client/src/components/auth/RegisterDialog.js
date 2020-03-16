import React, { useContext, useState } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { CTX } from "../../ContextStore";

import { makeStyles } from "@material-ui/core/styles";

import ProgressButton from "../ProgressButton";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Typography, Container } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import InputAdornment from "@material-ui/core/InputAdornment";
import AccountCircle from "@material-ui/icons/AccountCircle";

import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { register } from "../../actions/auth";

const useStyles = makeStyles(theme => ({
  loginDialog: {
    padding: theme.spacing(3)
  },
  titleContainer: {
    padding: theme.spacing(3),
    paddingTop: "1.5em"
  }
}));

const RegisterDialog = ({ register, isAuthenticated }) => {
  const classes = useStyles();

  // const { state, dispatch } = useContext(CTX);
  // const { error } = state.loginDialog;

  const [formValue, setFormValue] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: ""
  });

  const { username, email, password, passwordConfirm } = formValue;

  const onChange = e =>
    setFormValue({ ...formValue, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();

    register(formValue);

    // if (value !== "") {
    // }
  };

  if (isAuthenticated) {
    return <Redirect to="/" />;
  }

  return (
    <Dialog
      className={classes.loginDialog}
      fullWidth
      open
      component="form"
      aria-labelledby="form-dialog-title"
    >
      <Container className={classes.titleContainer}>
        <Typography variant="h4">Hello! Welcome to MaterialChat!</Typography>
        <Typography variant="h6">
          Register an account to log in and begin chatting!
        </Typography>
      </Container>
      <DialogTitle id="form-dialog-title">Register</DialogTitle>
      <form onSubmit={e => onSubmit(e)}>
        <DialogContent>
          <DialogContentText>
            Please enter a username that is not currently in use.
          </DialogContentText>

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
              )
            }}
            placeholder="Enter username..."
            //TODO: fix error handling - helperText={error ? "Username is taken." : ""}
            value={username}
            onChange={e => {
              // if (error) {
              //   dispatch({ type: "LOGIN_ERROR_CLEARED" });
              // }
              onChange(e);
            }}
          />
          <TextField
            autoFocus
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
              )
            }}
            placeholder="Email"
            //TODO: fix error handling - helperText={error ? "Email is already registered." : ""}
            value={email}
            onChange={e => {
              onChange(e);
              //TODO: fix error handling -
              // if (error) {
              //   // dispatch({ type: "LOGIN_ERROR_CLEARED" });
              // }
            }}
          />
          <TextField
            autoFocus
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
              )
            }}
            placeholder="Password"
            //TODO: fix error handling - helperText={error ? "Incorrect Password." : ""}
            value={password}
            onChange={e => {
              onChange(e);
              //TODO: fix error handling -
              // if (error) {
              //   // dispatch({ type: "LOGIN_ERROR_CLEARED" });
              // }
            }}
          />
          <TextField
            autoFocus
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
              )
            }}
            placeholder="Confirm Password"
            //TODO: fix error handling - helperText={error ? "Incorrect Password." : ""}
            value={passwordConfirm}
            onChange={e => {
              onChange(e);
              //TODO: fix error handling -
              // if (error) {
              //   // dispatch({ type: "LOGIN_ERROR_CLEARED" });
              // }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Link to="/login">
            <Typography>Already have an account?</Typography>
          </Link>

          <ProgressButton
            title="Sign Up"
            type="submit"
            color="primary"
            loading=""
          />
        </DialogActions>
      </form>
    </Dialog>
  );
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { register })(RegisterDialog);
