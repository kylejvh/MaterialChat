import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Formik, Form } from "formik";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { notify } from "../actions/notify";
import { updateUserData, updatePassword } from "../actions/auth";
import CustomFormikField from "./../utils/formik/CustomFormikField";
import {
  emailUsernameSchema,
  passwordSchema,
} from "./../utils/formik/settingsSchema";
import FullscreenDialog from "../utils/FullscreenDialog";
import ProgressButton from "./ProgressButton";
import PhotoUpload from "./../components/auth/register/PhotoUpload";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContentText from "@material-ui/core/DialogContentText";
import SettingsSharpIcon from "@material-ui/icons/SettingsSharp";
import Tooltip from "@material-ui/core/Tooltip";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(3),
    },
  },
  dialogDescription: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  dialogContent: {
    padding: theme.spacing(2),
    flexGrow: 1,
    maxWidth: 600,
  },
}));

const Settings = ({ currentUser, updateUserData, updatePassword, notify }) => {
  const classes = useStyles();
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const [open, setOpen] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState(false);

  useEffect(() => {
    if (currentUser.role === "guest" && open) {
      notify(
        "info",
        "Changes to guest accounts are temporary and will not persist beyond expiration."
      );
    }
  }, [currentUser, notify, open]);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const passwordInputProps = {
    endAdornment: (
      <InputAdornment position="end">
        <IconButton
          aria-label="toggle password visibility"
          onClick={() => setPasswordVisibility(!passwordVisibility)}
          onMouseDown={handleMouseDownPassword}
          edge="end"
        >
          {passwordVisibility ? <Visibility /> : <VisibilityOff />}
        </IconButton>
      </InputAdornment>
    ),
  };

  const settingsList = ["Email & Username", "Password", "Avatar"];

  const editEmailUsername = (
    <>
      <DialogContentText
        id="settings-dialog-description"
        className={classes.dialogDescription}
      >
        Change your username and email.
      </DialogContentText>
      <Typography>
        Current Username: <b>{currentUser.username} </b>
      </Typography>
      <Typography>
        Current Email: <b>{currentUser.email}</b>
      </Typography>

      <Formik
        initialValues={{
          username: "",
          email: "",
          passwordCurrent: "",
        }}
        validationSchema={emailUsernameSchema}
        validateOnBlur={false}
        onSubmit={(values, { setSubmitting }) => {
          updateUserData(values);
          setSubmitting(false);
        }}
      >
        <Form>
          <CustomFormikField
            fullWidth
            margin="dense"
            name="username"
            type="text"
            label="Username"
            placeholder="Username"
          />

          <CustomFormikField
            fullWidth
            margin="dense"
            name="email"
            type="email"
            label="Email"
            placeholder="Email"
          />

          <CustomFormikField
            fullWidth
            margin="dense"
            label="Current Password"
            name="passwordCurrent"
            placeholder="Current Password"
            type={passwordVisibility ? "text" : "password"}
            InputProps={smallScreen ? passwordInputProps : null}
          />

          <Divider style={{ marginTop: "1em" }} />
          <DialogActions>
            <ProgressButton
              title="Save"
              type="submit"
              color="primary"
              loading=""
            />
          </DialogActions>
        </Form>
      </Formik>
    </>
  );

  const editPassword = (
    <>
      <DialogContentText
        id="settings-dialog-description"
        className={classes.dialogDescription}
      >
        Change your password.
      </DialogContentText>
      <Formik
        initialValues={{
          passwordCurrent: "",
          newPassword: "",
          newPasswordConfirm: "",
        }}
        validationSchema={passwordSchema}
        validateOnBlur={false}
        onSubmit={(values, { setSubmitting }) => {
          updatePassword(values);
          setSubmitting(false);
        }}
      >
        <Form>
          <CustomFormikField
            fullWidth
            margin="dense"
            label="Current Password"
            name="passwordCurrent"
            placeholder="Current Password"
            type={passwordVisibility ? "text" : "password"}
            InputProps={smallScreen ? passwordInputProps : null}
          />

          <CustomFormikField
            fullWidth
            margin="dense"
            label="New Password"
            name="newPassword"
            placeholder="New Password"
            type={passwordVisibility ? "text" : "password"}
            InputProps={smallScreen ? passwordInputProps : null}
          />

          <CustomFormikField
            fullWidth
            margin="dense"
            label="Confirm New Password"
            name="newPasswordConfirm"
            placeholder="Confirm New Password"
            type={passwordVisibility ? "text" : "password"}
            InputProps={smallScreen ? passwordInputProps : null}
          />

          <Divider style={{ marginTop: "1em" }} />
          <DialogActions>
            <ProgressButton
              title="Save"
              type="submit"
              color="primary"
              loading=""
            />
          </DialogActions>
        </Form>
      </Formik>
    </>
  );

  const editAvatar = (
    <>
      <DialogContentText
        id="settings-dialog-description"
        className={classes.dialogDescription}
      >
        Update or remove your avatar.
      </DialogContentText>

      <PhotoUpload settingsPanel={true} />
    </>
  );

  return (
    <>
      <Tooltip title="Settings">
        <IconButton
          aria-label="settings"
          onClick={() => setOpen(true)}
          color="inherit"
          children={<SettingsSharpIcon />}
        ></IconButton>
      </Tooltip>

      <FullscreenDialog
        dialogTitle="Settings"
        topicList={settingsList}
        componentList={[editEmailUsername, editPassword, editAvatar]}
        isOpen={open}
        handleClose={() => setOpen(false)}
        ariaDescriptionID="settings-dialog-description"
      ></FullscreenDialog>
    </>
  );
};

const mapStateToProps = ({ auth }) => ({
  currentUser: auth.currentUser,
});

export default connect(mapStateToProps, {
  updateUserData,
  updatePassword,
  notify,
})(Settings);
