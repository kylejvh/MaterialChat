import React, { useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { Formik, Form } from "formik";

import CustomFormikField from "../../utils/formik/CustomFormikField";
import {
  editChatroomSchema,
  deleteChatroomSchema,
} from "../../utils/formik/chatroomSettingsSchema";
import { deleteChatroom } from "../../actions/chatroom";
import ProgressButton from "./../ProgressButton";
import FullscreenDialog from "./../../utils/FullscreenDialog";
import DialogContentText from "@material-ui/core/DialogContentText";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Tooltip from "@material-ui/core/Tooltip";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";

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

const EditChatroom = ({ chatroomToEdit: chatroom, deleteChatroom }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const history = useHistory();

  const handleRedirect = () => {
    history.push("/");
    setOpen(false);
  };

  const editChatroomTopics = ["General", "Delete Chatroom"];

  {
    /* General - Change Chatroom name and other options */
  }

  {
    /* Delete Chatroom - type chatroom name to delete, and check if value === chatroomname? */
  }

  const renderEditName = (
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

  const renderDeleteChatroom = (
    <>
      <DialogContentText id="editchatroom-dialog-description">
        Type the chatroom name to delete this chatroom. <br />
        This action cannot be undone.
      </DialogContentText>
      <Typography variant="h6">{chatroom.name}</Typography>
      <Formik
        initialValues={{
          confirmChatroomName: "",
        }}
        validationSchema={() => deleteChatroomSchema(chatroom.name)}
        validateOnBlur={false}
        onSubmit={({ setSubmitting }) => {
          deleteChatroom(chatroom._id, handleRedirect);
          setSubmitting(false);
        }}
      >
        <Form>
          <CustomFormikField
            fullWidth
            margin="dense"
            label="Chatroom Name"
            name="confirmChatroomName"
            type="text"
            placeholder="Chatroom Name"
          />
          <Divider style={{ marginTop: "1em" }} />
          <DialogActions>
            <ProgressButton
              title="Delete"
              type="submit"
              color="primary"
              loading=""
            />
          </DialogActions>
        </Form>
      </Formik>
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
        componentList={[renderEditName, renderDeleteChatroom]}
        isOpen={open}
        handleClose={() => setOpen(false)}
        ariaDescriptionID="editchatroom-dialog-description"
      ></FullscreenDialog>
    </>
  );
};

export default connect(null, { deleteChatroom })(EditChatroom);
