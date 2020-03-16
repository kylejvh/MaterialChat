import React, { useState } from "react";
import { connect } from "react-redux";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Tooltip from "@material-ui/core/Tooltip";
import Drawer from "@material-ui/core/Drawer";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText";
import TextField from "@material-ui/core/TextField";
import ProgressButton from "./../ProgressButton";

import { makeStyles } from "@material-ui/core/styles";

import Divider from "@material-ui/core/Divider";

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

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3)
  }
}));

const EditChatroom = ({}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
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

  const submitFieldChange = (e, { ...fields }, type) => {
    e.preventDefault();
  };

  return (
    <>
      <Tooltip title="Edit Chatroom">
        <IconButton
          aria-label="settings"
          onClick={handleClickOpen}
          color="inherit"
          children={<MenuIcon />}
        ></IconButton>
      </Tooltip>

      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <DialogContent className={classes.appBar}>
          <DialogTitle id="dialog-title">Chatroom Settings</DialogTitle>

          <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
              paper: classes.drawerPaper
            }}
            anchor="left"
          >
            <div className={classes.toolbar} />
            <Divider />
            <List>
              {["General", "Delete Chatroom"].map((text, index) => (
                <ListItem button key={index}>
                  <ListItemText
                    primary={text}
                    onClick={() => setValue(index)}
                  />
                </ListItem>
              ))}
            </List>
          </Drawer>

          {/* General - Change Chatroom name and other options */}
          {value === 0 && (
            <>
              <DialogContentText id="dialog-description">
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
                  onChange={e => {
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
          )}
          {/* Permissions - Change chatroom password, maybe blacklist users? */}

          {/* Delete Chatroom - type chatroom name to delete, and check if value === chatroomname? */}
          {value === 1 && (
            <>
              <DialogContentText id="dialog-description">
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
                  onChange={e => {
                    // onChange(e);
                    // if (error) {
                    //   // dispatch({ type: "LOGIN_ERROR_CLEARED" });
                    // }
                  }}
                />
                <ProgressButton title="Confirm" formId="email" />
              </form>
            </>
          )}
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

const mapStateToProps = state => ({});

export default connect(mapStateToProps, {})(EditChatroom);
