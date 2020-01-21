import React, { useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
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

const useStyles = makeStyles({
  AddChatroomButton: {
    margin: "2em 2em",

    "@media (max-width: 600px)": {
      margin: "1em .25em"
    }
  }
});

const AddChatroomDialog = () => {
  const { requestNewChatroom, state, dispatch } = useContext(CTX);
  const { isOpen, error, success } = state.addChatroomDialog;
  const [newChatroom, setNewChatroom] = useState("");
  const classes = useStyles();

  const submitChatroomRequest = e => {
    e.preventDefault();
    if (newChatroom === "") {
      return;
    }
    requestNewChatroom({
      chatroomName: newChatroom
    });
    setNewChatroom("");
  };

  return (
    <>
      <Fab
        className={classes.AddChatroomButton}
        variant="extended"
        color="primary"
        size="small"
        onClick={() => dispatch({ type: "ADD_CHATROOM_DIALOG_OPENED" })}
        aria-label="add"
      >
        <AddIcon />
        Chatroom
      </Fab>

      <Dialog
        open={isOpen}
        onClose={() => dispatch({ type: "ADD_CHATROOM_DIALOG_CLOSED" })}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Create Chatroom</DialogTitle>
        <form onSubmit={submitChatroomRequest}>
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
              error={error}
              helperText={error ? "Chatroom name is taken." : ""}
              margin="dense"
              fullWidth
              onChange={e => {
                if (error) {
                  dispatch({ type: "ADD_CHATROOM_ERROR_CLEARED" });
                }
                setNewChatroom(e.target.value);
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => dispatch({ type: "ADD_CHATROOM_DIALOG_CLOSED" })}
              color="primary"
              variant="outlined"
            >
              Cancel
            </Button>
            <Button color="primary" variant="outlined" type="submit">
              Confirm
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => dispatch({ type: "ADD_CHATROOM_SUCCESS_EXPIRED" })}
        message="Chatroom Created!"
      />
    </>
  );
};

export default AddChatroomDialog;
