import React, { useState, useContext } from "react";
import { CTX } from "./Store";

import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useMediaQuery } from "react-responsive";

import ChatWindow from "./Components/ChatWindow";
import LoginDialog from "./Components/LoginDialog";
import AddChatroomDialog from "./Components/AddChatroomDialog";
import LogoutDialog from "./Components/LogoutDialog";

import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItemText from "@material-ui/core/ListItemText";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import BrightnessLowOutlinedIcon from "@material-ui/icons/BrightnessLowOutlined";
import Brightness4OutlinedIcon from "@material-ui/icons/Brightness4Outlined";

const drawerWidth = 240;
const mobileDrawerWidth = 120;

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
    }),

    "@media (max-width: 600px)": {
      width: `calc(100% - ${mobileDrawerWidth}px)`,
      marginLeft: mobileDrawerWidth,
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
      })
    }
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
    flexShrink: 0,

    "@media (max-width: 600px)": {
      width: mobileDrawerWidth
    }
  },
  drawerPaper: {
    width: drawerWidth,

    "@media (max-width: 600px)": {
      width: mobileDrawerWidth
    }
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
    marginLeft: -drawerWidth,

    "@media (max-width: 600px)": {
      marginLeft: -mobileDrawerWidth
    }
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  },
  navTitle: {
    flexGrow: 1
  },
  addChatroomButton: {
    display: "flex",
    alignItems: "flex-end",
    flex: "1"
  }
}));

const Dashboard = props => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery({ query: "(max-width: 600px)" });

  // CTX store
  const { state, requestJoinChatroom } = useContext(CTX);

  const { username, currentChatroom } = state.currentUser;

  const chatrooms = Object.keys(state.chatrooms);

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

  return state.loginDialog.isOpen ? (
    <>
      <LoginDialog />
    </>
  ) : (
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
            {isMobile
              ? currentChatroom
                ? currentChatroom
                : "Welcome!"
              : currentChatroom
              ? `Current Chatroom: ${currentChatroom}`
              : "Welcome!"}
          </Typography>

          <div className={classes.appBarButtons}>
            <IconButton
              aria-label="delete"
              onClick={props.changeTheme}
              color="inherit"
              children={
                props.isDarkTheme ? (
                  <Brightness4OutlinedIcon />
                ) : (
                  <BrightnessLowOutlinedIcon />
                )
              }
            ></IconButton>
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

        <List
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              Available Chatrooms:
            </ListSubheader>
          }
        >
          <Divider />
          {chatrooms.map((chatroom, i) => (
            <div key={i}>
              <ListItem onClick={() => handleChatroomChange(chatroom)} button>
                <ListItemText primary={chatroom} />
              </ListItem>
              <Divider />
            </div>
          ))}
        </List>
        <div className={classes.addChatroomButton}>
          <AddChatroomDialog />
        </div>
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
  );
};

export default Dashboard;
