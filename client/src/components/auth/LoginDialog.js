import React, { useContext, useState } from "react";
import { CTX } from "../Store";

import { makeStyles } from "@material-ui/core/styles";

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

const LoginDialog = () => {
  const classes = useStyles();

  const { requestUsername, state, dispatch } = useContext(CTX);
  const { error } = state.loginDialog;
  const [value, setValue] = useState("");

  const handleUsernameSubmit = e => {
    e.preventDefault();
    if (value !== "") {
      requestUsername({
        username: value
      });
    }
  };

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
          Enter a username to begin chatting.
        </Typography>
      </Container>
      <DialogTitle id="form-dialog-title">Login</DialogTitle>
      <form onSubmit={handleUsernameSubmit}>
        <DialogContent>
          <DialogContentText>
            To begin messaging, please enter a username that is not currently in
            use.
          </DialogContentText>

          <TextField
            autoFocus
            fullWidth
            margin="dense"
            label="Username"
            variant="filled"
            error={error}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              )
            }}
            placeholder="Enter username..."
            helperText={error ? "Username is taken." : ""}
            value={value}
            onChange={e => {
              if (error) {
                dispatch({ type: "LOGIN_ERROR_CLEARED" });
              }
              setValue(e.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            type="submit"
            color="primary"
            label="Submit"
          >
            Confirm
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default LoginDialog;
