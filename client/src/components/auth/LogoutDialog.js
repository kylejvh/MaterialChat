<<<<<<< HEAD
<<<<<<< HEAD:src/Components/LogoutDialog.js
import React, { useContext } from "react";
import { CTX } from "../Store";
=======
import React from "react";
import { connect } from "react-redux";
import { logout } from "../../actions/auth";
>>>>>>> development:client/src/components/auth/LogoutDialog.js
=======
<<<<<<<< HEAD:client/src/components/auth/LogoutDialog.js
import React from "react";
import { connect } from "react-redux";
import { logout } from "../../actions/auth";
========
import React, { useContext } from "react";
import { CTX } from "../Store";
>>>>>>>> development:src/Components/LogoutDialog.js
>>>>>>> development

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

<<<<<<< HEAD
<<<<<<< HEAD:src/Components/LogoutDialog.js
=======
<<<<<<<< HEAD:client/src/components/auth/LogoutDialog.js
const LogoutDialog = ({ logout }) => {
========
>>>>>>> development
const LogoutDialog = () => {
  const { state, handleLogout } = useContext(CTX);
  const { username, currentChatroom } = state.currentUser;

<<<<<<< HEAD
=======
const LogoutDialog = ({ logout }) => {
>>>>>>> development:client/src/components/auth/LogoutDialog.js
=======
>>>>>>>> development:src/Components/LogoutDialog.js
>>>>>>> development
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      <Button variant="outlined" color="inherit" onClick={handleClickOpen}>
        Logout
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to log out?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={() => logout()} color="primary" autoFocus>
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default connect(null, { logout })(LogoutDialog);
