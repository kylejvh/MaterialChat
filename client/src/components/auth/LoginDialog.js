import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { login } from "../../actions/auth";

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

const useStyles = makeStyles(theme => ({
  loginDialog: {
    padding: theme.spacing(3)
  },
  titleContainer: {
    padding: theme.spacing(3),
    paddingTop: "1.5em"
  }
}));

const LoginDialog = ({ login, isAuthenticated, error }) => {
  const classes = useStyles();

  //TODO: old ctx - const { requestUsername, state, dispatch } = useContext(CTX);
  //TODO: old ctx - const { error } = state.loginDialog;
  const [formValue, setFormValue] = useState({
    email: "",
    password: ""
  });

  const { email, password } = formValue;

  const onChange = e =>
    setFormValue({ ...formValue, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();

    if (e.target.value !== "") {
      login(email, password);
    }
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
        <Typography variant="h6">Please sign in to your account.</Typography>
      </Container>
      <DialogTitle id="form-dialog-title">Login</DialogTitle>
      <form
        id="login-form"
        onSubmit={e => {
          onSubmit(e);
          console.log(isAuthenticated, "auth status");
        }}
      >
        <DialogContent>
          <DialogContentText>
            To begin messaging, please enter your email and password.
          </DialogContentText>

          {/* Use materialUI Email and password Forms, look at docs. */}
          <TextField
            autoFocus
            fullWidth
            margin="normal"
            name="email"
            type="email"
            label="Email"
            variant="outlined"
            error={error}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              )
            }}
            placeholder="Email"
            helperText={error ? "Email is already registered." : ""}
            value={email}
            onChange={e => {
              onChange(e);
              if (error) {
                // dispatch({ type: "LOGIN_ERROR_CLEARED" });
              }
            }}
          />

          {/* TODO: Implement Auth - password form.  */}
          <TextField
            autoFocus
            fullWidth
            margin="normal"
            type="password"
            label="Password"
            name="password"
            variant="outlined"
            error={error}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              )
            }}
            placeholder="Password"
            helperText={error ? "Incorrect Password." : ""}
            value={password}
            onChange={e => {
              onChange(e);
              if (error) {
                // dispatch({ type: "LOGIN_ERROR_CLEARED" });
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Link to="/register">
            <Typography>Don't have an account?</Typography>
          </Link>

          {/* <Link to="/register">
            <Button variant="outlined" color="primary">
              Sign Up
            </Button>
          </Link> */}
          <ProgressButton
            title="Login"
            form="login-form"
            formId="login-form"
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

export default connect(mapStateToProps, { login })(LoginDialog);
