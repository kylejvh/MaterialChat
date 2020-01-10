import React, { useContext } from "react";
import { CTX } from "../Store";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  }
}));

// function Alert(props) {
//   return <MuiAlert elevation={6} variant="filled" {...props} />;
// }

const LoginForm = props => {
  const classes = useStyles();
  const theme = useTheme();

  const { requestUsername, chatAppState } = useContext(CTX);

  const { userId, setUserId } = props;

  const [open, setOpen] = React.useState(false);

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
    if (userId === "") {
      return alert("enter a name");
    }
    //! set errorstate on form and use materialui handling for error

    requestUsername({
      username: userId
    });

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

  return (
    <Paper>
      <form
        className={classes.root}
        onSubmit={handleUsernameSubmit}
        noValidate
        autoComplete="off"
      >
        <TextField
          label="Username"
          variant="filled"
          placeholder="Enter username..."
          value={userId}
          onChange={e => setUserId(e.target.value)}
        />
        <Button variant="outlined" type="submit">
          Confirm
        </Button>
      </form>

      <Snackbar
        open={chatAppState.loginDialog.displayLoginError}
        autoHideDuration={6000} /*onClose={handleClose} */
      >
        {/* <Alert onClose={handleClose} color="error">
          This username is taken!
        </Alert> */}
      </Snackbar>
    </Paper>
  );
};

export default LoginForm;
