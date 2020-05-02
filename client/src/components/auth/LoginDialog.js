import React, { useState } from "react";
import { Link as RouterLink, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import { login } from "../../actions/auth";
import ProgressButton from "../ProgressButton";

import { makeStyles } from "@material-ui/core/styles";
import { Typography, Container } from "@material-ui/core";
import Link from "@material-ui/core/Link";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const useStyles = makeStyles((theme) => ({
  loginDialog: {
    padding: theme.spacing(3),
  },
  root: {
    "& > *": {
      margin: theme.spacing(3),
    },
  },
  titleContainer: {
    padding: theme.spacing(3),
    paddingTop: "1.5em",
  },
}));

const LoginDialog = ({ login, isAuthenticated, error }) => {
  const classes = useStyles();

  const [formValue, setFormValue] = useState({
    email: "",
    password: "",
    showPassword: false,
  });

  const { email, password, showPassword } = formValue;

  const handleClickShowPassword = () => {
    setFormValue({ ...formValue, showPassword: !showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const onChange = (e) =>
    setFormValue({ ...formValue, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
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
      </Container>

      <form
        className={classes.root}
        id="login-form"
        onSubmit={(e) => {
          onSubmit(e);
        }}
      >
        <DialogTitle id="form-dialog-title">Login</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To begin messaging, please enter your email and password.
          </DialogContentText>
          <TextField
            autoFocus
            required
            fullWidth
            id="loginEmail"
            margin="normal"
            name="email"
            type="email"
            label="Email"
            variant="outlined"
            error={error}
            placeholder="Email"
            helperText={error ? "Email is already registered." : ""}
            value={email}
            onChange={(e) => {
              onChange(e);
              if (error) {
                // dispatch({ type: "LOGIN_ERROR_CLEARED" });
              }
            }}
          />

          <TextField
            required
            fullWidth
            id="loginPassword"
            margin="normal"
            type={showPassword ? "text" : "password"}
            label="Password"
            name="password"
            variant="outlined"
            error={error}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            placeholder="Password"
            helperText={error ? "Incorrect Password." : ""}
            value={password}
            onChange={(e) => {
              onChange(e);
              if (error) {
                // dispatch({ type: "LOGIN_ERROR_CLEARED" });
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Link component={RouterLink} to="/register">
            Don't have an account?
          </Link>
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

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { login })(LoginDialog);
