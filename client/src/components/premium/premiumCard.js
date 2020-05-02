// Build out a button at the top bar or somewhere visible
// That opens a dialog or card
// Allowing you to sign up for premium
// Which also shows cost and benefit of doing so.

//! DO I need to send userid along to stripe endpoint?

if (isAutheniticated) {
  // probably don't need to check for auth.
  // just show component
}
import React, { useState } from "react";
import { connect } from "react-redux";
import { updateUserData, deleteAccount } from "../actions/auth";

import ProgressButton from "./ProgressButton";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import IconButton from "@material-ui/core/IconButton";
import SettingsSharpIcon from "@material-ui/icons/SettingsSharp";
import Tooltip from "@material-ui/core/Tooltip";

import { makeStyles } from "@material-ui/core/styles";

import Divider from "@material-ui/core/Divider";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  details: {
    alignItems: "center",
  },
  column: {
    flexBasis: "33.33%",
  },
}));

const Premium = ({}) => {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState({
    username: "",
    email: "",
    passwordCurrent: "",
    password: "",
    passwordConfirm: "",
    showNewPassword: false,
    showCurrentPassword: false,
  });

  const onChange = (e) =>
    setValues({ ...values, [e.target.name]: e.target.value });

  const {
    username,
    email,
    passwordCurrent,
    password,
    passwordConfirm,
    showNewPassword,
    showCurrentPassword,
  } = values;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const handleClickShowPassword = (newPass) => {
    if (newPass === "newPassword") {
      setValues({
        ...values,
        showNewPassword: !showNewPassword,
      });
    } else {
      setValues({
        ...values,
        showCurrentPassword: !showCurrentPassword,
      });
    }
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const classes = useStyles();

  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const submitFieldChange = (e, { ...fields }, type) => {
    e.preventDefault();
    if (Object.values(fields).includes("")) {
      return;
    } else if (type === "data") {
      updateUserData(fields, "data"); // old way, review this func in other places
      setValues({
        ...values,
        email: "",
        username: "",
      });
    } else if (type === "password") {
      updateUserData(fields, "data"); // old way, review this func in other places
      updateUserData(fields, "password");
      setValues({
        ...values,
        passwordCurrent: "",
        password: "",
        passwordConfirm: "",
      });
    }
  };

  return (
    <>
      <Tooltip title="Settings">
        <IconButton
          aria-label="settings"
          onClick={handleClickOpen}
          color="inherit"
          children={<SettingsSharpIcon />}
        ></IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth={true}
        maxWidth="md"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Settings</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Adjust your account settings.
          </DialogContentText>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const mapStateToProps = (state) => ({
  currentUsername: state.auth.currentUser.username,
  currentEmail: state.auth.currentUser.email,
});

export default connect(mapStateToProps, {
  updateUserData,
  deleteAccount,
})(Premium);
