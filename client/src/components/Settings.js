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
import ExpansionPanel from "@material-ui/core/ExpansionPanel";

import Divider from "@material-ui/core/Divider";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";

import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import TextField from "@material-ui/core/TextField";

import InputAdornment from "@material-ui/core/InputAdornment";
import AccountCircle from "@material-ui/icons/AccountCircle";

import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

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

const Settings = ({
  updateUserData,
  deleteAccount,
  currentEmail,
  currentUsername,
}) => {
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

  // const useStyles = makeStyles(theme => ({
  //   form: {
  //     display: "flex",
  //     flexDirection: "column",
  //     margin: "auto",
  //     width: "fit-content"
  //   },
  //   formControl: {
  //     marginTop: theme.spacing(2),
  //     minWidth: 120
  //   },
  //   formControlLabel: {
  //     marginTop: theme.spacing(1)
  //   }
  // }));
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
      updateUserData({ ...fields, type: "data" });
      setValues({
        ...values,
        email: "",
        username: "",
      });
    } else if (type === "password") {
      updateUserData({ ...fields, type: "password" });
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

          <div className={classes.root}>
            <ExpansionPanel
              expanded={expanded === "panel1"}
              onChange={handleChange("panel1")}
            >
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <div className={classes.column}>
                  <Typography className={classes.heading}>Username</Typography>
                </div>
                <div className={classes.column}>
                  <Typography className={classes.secondaryHeading}>
                    Change your username.
                  </Typography>
                </div>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails className={classes.details}>
                <div className={classes.column} />
                <div className={classes.column}>
                  <Typography>Current Username: {currentUsername}</Typography>
                  <form
                    onSubmit={(e) => submitFieldChange(e, { username }, "data")}
                    id="username"
                  >
                    <TextField
                      margin="normal"
                      name="username"
                      type="username"
                      label="Username"
                      variant="outlined"
                      // error={error}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AccountCircle />
                          </InputAdornment>
                        ),
                      }}
                      placeholder="Username"
                      // helperText={error ? "Email is already registered." : ""}
                      value={username}
                      onChange={(e) => {
                        onChange(e);
                        // if (error) {
                        //   // dispatch({ type: "LOGIN_ERROR_CLEARED" });
                        // }
                      }}
                    />

                    <ProgressButton title="Confirm" formId="username" />
                  </form>
                </div>
              </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel
              expanded={expanded === "panel2"}
              onChange={handleChange("panel2")}
            >
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2-content"
                id="panel2-header"
              >
                <div className={classes.column}>
                  <Typography className={classes.heading}>Email</Typography>
                </div>
                <div className={classes.column}>
                  <Typography className={classes.secondaryHeading}>
                    Change your email.
                  </Typography>
                </div>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails className={classes.details}>
                <div className={classes.column} />
                <div className={classes.column}>
                  <Typography>Current Email: {currentEmail}</Typography>
                  <form
                    onSubmit={(e) => submitFieldChange(e, { email }, "data")}
                    id="email"
                  >
                    <TextField
                      margin="normal"
                      name="email"
                      type="email"
                      label="Email"
                      variant="outlined"
                      // error={error}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AccountCircle />
                          </InputAdornment>
                        ),
                      }}
                      placeholder="Email"
                      // helperText={error ? "Email is already registered." : ""}
                      value={email}
                      onChange={(e) => {
                        onChange(e);
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
                </div>
              </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel
              expanded={expanded === "panel3"}
              onChange={handleChange("panel3")}
            >
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel3-content"
                id="panel3-header"
              >
                <div className={classes.column}>
                  <Typography className={classes.heading}>Password</Typography>
                </div>
                <div className={classes.column}>
                  <Typography className={classes.secondaryHeading}>
                    Change your password.
                  </Typography>
                </div>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <div className={classes.column} />
                <div className={classes.column}>
                  <form
                    onSubmit={(e) =>
                      submitFieldChange(
                        e,
                        {
                          passwordCurrent,
                          password,
                          passwordConfirm,
                        },
                        "password"
                      )
                    }
                    id="password"
                  >
                    <TextField
                      margin="normal"
                      type={showCurrentPassword ? "text" : "password"}
                      label="Current Password"
                      name="passwordCurrent"
                      variant="outlined"
                      // error={error}
                      InputProps={
                        ({
                          startAdornment: (
                            <InputAdornment position="start">
                              <AccountCircle />
                            </InputAdornment>
                          ),
                        },
                        {
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                              >
                                {showCurrentPassword ? (
                                  <Visibility />
                                ) : (
                                  <VisibilityOff />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        })
                      }
                      placeholder="Current Password"
                      // helperText={error ? "Incorrect Password." : ""}
                      value={passwordCurrent}
                      onChange={(e) => {
                        onChange(e);
                        // if (error) {
                        //   // dispatch({ type: "LOGIN_ERROR_CLEARED" });
                        // }
                      }}
                    />

                    <TextField
                      margin="normal"
                      type={showNewPassword ? "text" : "password"}
                      label="New Password"
                      name="password"
                      variant="outlined"
                      // error={error}
                      InputProps={
                        ({
                          startAdornment: (
                            <InputAdornment position="start">
                              <AccountCircle />
                            </InputAdornment>
                          ),
                        },
                        {
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={() =>
                                  handleClickShowPassword("newPassword")
                                }
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                              >
                                {showNewPassword ? (
                                  <Visibility />
                                ) : (
                                  <VisibilityOff />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        })
                      }
                      placeholder="New Password"
                      // helperText={error ? "Incorrect Password." : ""}
                      value={password}
                      onChange={(e) => {
                        onChange(e);
                        // if (error) {
                        //   // dispatch({ type: "LOGIN_ERROR_CLEARED" });
                        // }
                      }}
                    />
                    <TextField
                      margin="normal"
                      type={showNewPassword ? "text" : "password"}
                      label="Confirm New Password"
                      name="passwordConfirm"
                      variant="outlined"
                      //TODO: fix error handling -  error={error}
                      InputProps={
                        ({
                          startAdornment: (
                            <InputAdornment position="start">
                              <AccountCircle />
                            </InputAdornment>
                          ),
                        },
                        {
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={() =>
                                  handleClickShowPassword("newPassword")
                                }
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                              >
                                {showNewPassword ? (
                                  <Visibility />
                                ) : (
                                  <VisibilityOff />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        })
                      }
                      placeholder="Confirm New Password"
                      //TODO: fix error handling - helperText={error ? "Incorrect Password." : ""}
                      // value={passwordConfirm}
                      onChange={(e) => {
                        onChange(e);
                        //TODO: fix error handling -
                        // if (error) {
                        //   // dispatch({ type: "LOGIN_ERROR_CLEARED" });
                        // }
                      }}
                    />
                    <ProgressButton title="Confirm" formId="password" />
                  </form>
                </div>
              </ExpansionPanelDetails>
            </ExpansionPanel>
            {/* <ExpansionPanel
              expanded={expanded === "panel4"}
              onChange={handleChange("panel4")}
            >
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel4-content"
                id="panel4-header"
              >
                <div className={classes.column}>
                  <Typography className={classes.heading}>
                    Personalization
                  </Typography>
                </div>
                <div className={classes.column}>
                  <Typography className={classes.secondaryHeading}>
                    Change your customization options.
                  </Typography>
                </div>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Typography>
                  Change your avatar and user colors here.
                </Typography>
              </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel
              expanded={expanded === "panel5"}
              onChange={handleChange("panel5")}
            >
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel5-content"
                id="panel5-header"
              >
                <div className={classes.column}>
                  <Typography className={classes.heading}>
                    Delete Account
                  </Typography>
                </div>
                <div className={classes.column}>
                  <Typography className={classes.secondaryHeading}>
                    Delete your account.
                  </Typography>
                </div>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails className={classes.details}>
                <Typography>
                  Confirm your password to permanently delete your account. You
                  cannot recover your account once it is deleted.
                </Typography>
              </ExpansionPanelDetails>
            </ExpansionPanel> */}
          </div>
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
})(Settings);
