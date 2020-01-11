//! follow the tut, then read Material UI docs and learn
//! how to use it, and how you want it to look, and refactor!

// set specific person to use a randomized color, or make a color picker for each person?

import React, { useState, useContext } from "react";
import { CTX } from "./Store";
import { makeStyles, useTheme } from "@material-ui/core/styles";

import Typography from "@material-ui/core/Typography";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

import ListItemText from "@material-ui/core/ListItemText";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
// import AddIcon from "@material-ui/icons/Add";

// persistent drawer
import clsx from "clsx";

import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

//! Start of refactor imports
import ChatWindow from "./Components/ChatWindow";
import LoginForm from "./Components/LoginForm";
import AddChatroomDialog from "./Components/AddChatroomDialog";
import LogoutDialog from "./Components/LogoutDialog";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  appBarButtons: {
    justifyContent: "flex-end"
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  hide: {
    display: "none"
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-end"
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: -drawerWidth
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  }, //! Start my styles
  navTitle: {
    flexGrow: 1
  } //! styles for onlinecard
}));

const Dashboard = props => {
  const classes = useStyles();
  const theme = useTheme();

  // CTX store
  const {
    chatAppState,
    handleTyping,
    requestJoinChatroom //! Make a toggles object??
  } = useContext(CTX);

  const { username, currentChatroom } = chatAppState.currentUser;

  const chatrooms = Object.keys(chatAppState.chatrooms);

  const [chatMessage, setChatMessage] = useState("");

  const [open, setOpen] = React.useState(true);

  const handleChatroomChange = chatroom => {
    if (chatroom === currentChatroom) {
      return;
    }
    requestJoinChatroom({
      username,
      chatroom
    });
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  //! Convert to uselocalstorage once regular hook works...
  // const [userId, setUserId] = useLocalStorage("id", "")
  //       //! set errorstate on form and use materialui handling for error

  return !chatAppState.loginDialog.displayLoginDialog ? ( //! !!! HACKY TEMP SOLUTION !!!!!!
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>

          <Typography className={classes.navTitle} variant="h6" noWrap>
            {currentChatroom
              ? `Current Chatroom: ${currentChatroom}`
              : "Welcome!"}
          </Typography>

          <div className={classes.appBarButtons}>
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={props.currentTheme}
                  onChange={props.toggleTheme}
                />
              }
              label="Theme"
            />
            <LogoutDialog></LogoutDialog>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        <List>
          {chatrooms.map(chatroom => (
            <ListItem
              onClick={() => handleChatroomChange(chatroom)}
              key={chatroom}
              button
            >
              <ListItemText primary={chatroom} />
            </ListItem>
          ))}
        </List>

        <Divider />
        <AddChatroomDialog></AddChatroomDialog>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open
        })}
      >
        <div className={classes.drawerHeader} />

        <ChatWindow
          chatMessage={chatMessage}
          setChatMessage={setChatMessage}
        ></ChatWindow>
      </main>
    </div>
  ) : (
    <LoginForm></LoginForm>
  );
};

export default Dashboard;
