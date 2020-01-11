import React, { useContext, useState } from "react";
import { CTX } from "../Store";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import Backdrop from "@material-ui/core/Backdrop";
import { Typography } from "@material-ui/core";

import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const useStyles = makeStyles(theme => ({
  root: {
    width: "80%",
    height: "80%",
    display: "flex",
    flexDirection: "column"
  }
}));

// function Alert(props) {
//   return <MuiAlert elevation={6} variant="filled" {...props} />;
// }

const LoginForm = () => {
  const classes = useStyles();
  const theme = useTheme();

  const { requestUsername, chatAppState } = useContext(CTX);
  const { displayLoginError, displayLoginDialog } = chatAppState.loginDialog;

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  //! user handling needs to be refactored.....
  //! how do you handle a new user?
  //! set state and store user, but then initialize socket?

  const handleUsernameSubmit = e => {
    e.preventDefault();
    if (value !== "") {
      requestUsername({
        username: value
      });
    }

    // how to do form validation??? ??

    // send local userid to server
    // if server doesnt have it, add the userid to state list and change isactive to true.

    //! do I need a promise?
    // find state entries that match and check isactive...

    // chatappstate.users.username === string
    // userID === string

    // const newarr = chatAppState.users.map(user => user.username == userId);

    // const testarr = obj.users.map(entry => entry.username == userId);
    // console.log("sanitycheck", testarr);
    // console.log("sanitycheck2", testarr.isActive);
    // if (
    //   .isActive === true
    // ) {
    //   setLocalUserIsActive(true);
    //   setUserId("");
    //   alert("bingo diceman");
    // }

    // AM i assigning state in payload correctly?

    // then do below!
    // find chatappstate.userId that matches state.userID
    // check isactive property, then do below.

    // }

    // sendUsername({ user: userId });
  };

  //   const DialogContent = withStyles(theme => ({
  //     root: {
  //       padding: theme.spacing(2),
  //     },
  //   }))(MuiDialogContent);

  //   const DialogActions = withStyles(theme => ({
  //     root: {
  //       margin: 0,
  //       padding: theme.spacing(1),
  //     },
  //   }))(MuiDialogActions);

  return (
    <div>
      <Backdrop className={classes.backdrop} open={true}>
        <Dialog
          open={true}
          onClose={displayLoginDialog}
          aria-labelledby="form-dialog-title"
          onSubmit={handleUsernameSubmit}
        >
          <DialogTitle id="form-dialog-title">Login</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To begin messaging, please enter a username that is not currently
              in use.
            </DialogContentText>

            <TextField
              autoFocus
              fullWidth
              margin="dense"
              label="Username"
              variant="filled"
              error={displayLoginError}
              placeholder="Enter username..."
              helperText={displayLoginError ? "Username taken." : ""}
              value={value}
              onChange={e => {
                setValue(e.target.value);
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" type="submit" color="primary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={chatAppState.loginDialog.displayLoginError}
          autoHideDuration={6000}
          onClose={handleClose}
        >
          {/* <Alert onClose={handleClose} color="error">
          This username is taken!
        </Alert> */}
        </Snackbar>

        {/* <Paper>
          <Typography variant="h2">Hello! Welcome to Chatsby!</Typography>
          <Typography variant="h5">
            Enter a username to begin chatting.
          </Typography>
          <form
            className={classes.root}
            onSubmit={handleUsernameSubmit}
            noValidate
            autoComplete="off"
          >
               <TextField
              autoFocus
              fullWidth
              margin="dense"
              label="Username"
              variant="filled"
              error={displayLoginError}
              placeholder="Enter username..."
              helperText={displayLoginError ? "Username taken." : ""}
              value={value}
              onChange={e => {
                setValue(e.target.value);
              }} />
          </form>
          <Snackbar
            open={chatAppState.loginDialog.displayLoginError}
            autoHideDuration={6000}
            onClose={handleClose}
          >
            <Alert onClose={handleClose} color="error">
          This username is taken!
        </Alert> 
          </Snackbar>
        </Paper> */}
      </Backdrop>
    </div>
  );
};

export default LoginForm;
