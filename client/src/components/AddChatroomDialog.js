import React, { useState } from "react";
import { connect } from "react-redux";
import { createChatroom, openDialog, closeDialog } from "../actions/chatroom";

import { makeStyles } from "@material-ui/core/styles";

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

const AddChatroomDialog = ({
  createChatroom,
  openDialog,
  closeDialog,
  isOpen
}) => {
  const [newChatroom, setNewChatroom] = useState("");
  const classes = useStyles();

  const onSubmit = e => {
    e.preventDefault();
    if (newChatroom === "") {
      return;
    }

    createChatroom(newChatroom);

    setNewChatroom("");
  };

  return (
    <>
      <Fab
        className={classes.AddChatroomButton}
        variant="extended"
        color="primary"
        size="small"
        onClick={openDialog}
        aria-label="add"
      >
        <AddIcon />
        Chatroom
      </Fab>

      <Dialog
        open={isOpen}
        onClose={closeDialog}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Create Chatroom</DialogTitle>
        <form onSubmit={e => onSubmit(e)}>
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
              // error={error}
              // helperText={error ? "Chatroom name is taken." : ""}
              margin="dense"
              fullWidth
              onChange={e => {
                // if (error) {
                //   dispatch({ type: "ADD_CHATROOM_ERROR_CLEARED" });
                // }
                setNewChatroom(e.target.value);
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog} color="primary" variant="outlined">
              Cancel
            </Button>
            <Button color="primary" variant="outlined" type="submit">
              Confirm
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

const mapStateToProps = state => ({
  isOpen: state.chatrooms.addChatroomDialog.isOpen
});

export default connect(mapStateToProps, {
  createChatroom,
  openDialog,
  closeDialog
})(AddChatroomDialog);
