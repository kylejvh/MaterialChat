import React, { useState } from "react";
import { connect } from "react-redux";

import DialogContentText from "@material-ui/core/DialogContentText";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Tooltip from "@material-ui/core/Tooltip";
import TextField from "@material-ui/core/TextField";
import ProgressButton from "./../ProgressButton";
import FullscreenDialog from "./../../utils/FullscreenDialog";

import { makeStyles } from "@material-ui/core/styles";

// const useStyles = makeStyles(theme => ({
//   root: {
//     width: "100%"
//   },
//   heading: {
//     fontSize: theme.typography.pxToRem(15),
//     flexBasis: "33.33%",
//     flexShrink: 0
//   },
//   secondaryHeading: {
//     fontSize: theme.typography.pxToRem(15),
//     color: theme.palette.text.secondary
//   },
//   details: {
//     alignItems: "center"
//   },
//   column: {
//     flexBasis: "33.33%"
//   }
// }));

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
}));

const EditChatroom = ({}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const submitFieldChange = (e, { ...fields }, type) => {
    e.preventDefault();
  };

  const editChatroomTopics = ["General", "Delete Chatroom"];

  {
    /* General - Change Chatroom name and other options */
  }

  {
    /* Delete Chatroom - type chatroom name to delete, and check if value === chatroomname? */
  }

  const editName = (
    <>
      <DialogContentText id="editchatroom-dialog-description">
        General settings for this chatroom
      </DialogContentText>
      <form
        // onSubmit={e => submitFieldChange(e, { email }, "data")}
        id="chatroom"
      >
        <TextField
          margin="normal"
          name="chatroom"
          type="text"
          label="Chatroom"
          variant="outlined"
          // error={error}

          placeholder="Chatroom Name"
          // helperText={error ? "Email is already registered." : ""}
          // value={email}
          onChange={(e) => {
            // onChange(e);
            // if (error) {
            //   // dispatch({ type: "LOGIN_ERROR_CLEARED" });
            // }
          }}
        />

        <ProgressButton title="Confirm" formId="email" />
        {/* 
                  <Button
                    variant="outlined"
                    type="submit"
                    color="primary"
                    label="Submit"
                  >
                    Confirm
                  </Button> */}
      </form>
    </>
  );

  const deleteChatroom = (
    <>
      <DialogContentText id="editchatroom-dialog-description">
        Permanently delete this chatroom
      </DialogContentText>
      <form
        // onSubmit={e => submitFieldChange(e, { email }, "data")}
        id="deleteChatroom"
      >
        <TextField
          margin="normal"
          name="deleteChatroom"
          type="text"
          label="Delete Chatroom"
          variant="outlined"
          // error={error}

          placeholder="Chatroom Name"
          // helperText={error ? "Email is already registered." : ""}
          // value={email}
          onChange={(e) => {
            // onChange(e);
            // if (error) {
            //   // dispatch({ type: "LOGIN_ERROR_CLEARED" });
            // }
          }}
        />
        <ProgressButton title="Confirm" formId="email" />
      </form>
    </>
  );

  return (
    <>
      <Tooltip title="Edit Chatroom">
        <IconButton
          aria-label="settings"
          onClick={() => setOpen(true)}
          color="inherit"
          children={<MenuIcon />}
        ></IconButton>
      </Tooltip>

      <FullscreenDialog
        dialogTitle="Edit Chatroom Settings"
        topicList={editChatroomTopics}
        componentList={[editName, deleteChatroom]}
        isOpen={open}
        handleClose={() => setOpen(false)}
        ariaDescriptionID="editchatroom-dialog-description"
      ></FullscreenDialog>
    </>
  );
};

const mapStateToProps = (state) => ({});

export default connect(null, {})(EditChatroom);
