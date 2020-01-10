//! consider changing the name of this component
import React, { useState, useContext } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { CTX } from "../Store";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import AddIcon from "@material-ui/icons/Add";
import Snackbar from "@material-ui/core/Snackbar";
import Slide from "@material-ui/core/Slide";

const useStyles = makeStyles(theme => ({
  AddChatroomButton: {
    // "&:hover": ${props =>
    //   props.hover ? ""
    //   width: "5rem"
    //   // size="small",
    //   // addprops: small, extended, addtext: chatroom
  }
}));

const AddChatroomDialog = () => {
  const { requestNewChatroom } = useContext(CTX);
  const [newChatroom, setNewChatroom] = useState(""); //! Do I need this? can I just pass off e.target.value?

  const [open, setOpen] = useState({
    snackbar: false,
    chatroomDialog: false
  });

  const classes = useStyles();

  const submitChatroomRequest = e => {
    e.preventDefault();
    if (newChatroom === "") {
      return alert("enter a chatroom name");
    }
    requestNewChatroom({
      //! can I just pass off e.target.value?
      chatroomName: newChatroom
    });
    //! handle alerting here

    setOpen({
      snackbar: true
    });
    setNewChatroom("");
  };

  return (
    <>
      <Fab
        className={classes.AddChatroomButton}
        color="primary"
        label="hello"
        onClick={() => setOpen({ chatroomDialog: true })}
        aria-label="add"
      >
        <AddIcon />
      </Fab>
      <Dialog
        open={open.chatroomDialog}
        onClose={() => setOpen({ chatroomDialog: false })}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Create Chatroom</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the name of the chatroom you wish to create. Chatroom names
            must be unique.
          </DialogContentText>

          <TextField
            autoComplete="off"
            id="name"
            label="Chatroom Name"
            variant="outlined"
            value={newChatroom}
            autoFocus
            margin="dense"
            fullWidth
            onChange={e => setNewChatroom(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpen({ chatroomDialog: false })}
            color="primary"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={submitChatroomRequest}
            color="primary"
            variant="outlined"
            type="submit"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={open.snackbar}
        onClose={() => setOpen({ snackbar: false })}
        message="Chatroom Created!"
      />
    </>
  );
};

export default AddChatroomDialog;
