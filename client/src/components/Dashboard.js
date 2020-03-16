import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  getChatrooms,
  joinChatroom,
  subscribeChatrooms
} from "../actions/chatroom";
import { Route, useRouteMatch, useHistory, Link } from "react-router-dom";

import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useMediaQuery } from "react-responsive";

import ChatWindow from "./ChatWindow";
import AddChatroomDialog from "./AddChatroomDialog";
import Settings from "./Settings";
import Friends from "./Friends";
import LogoutDialog from "./auth/LogoutDialog";
import Loader from "./notify/Loader";

import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItemText from "@material-ui/core/ListItemText";

import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Avatar from "@material-ui/core/Avatar";

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
import SettingsSharpIcon from "@material-ui/icons/SettingsSharp";
import Brightness4OutlinedIcon from "@material-ui/icons/Brightness4Outlined";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import Tooltip from "@material-ui/core/Tooltip";
import EditChatroom from "./chatroom/EditChatroom";

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

const Dashboard = ({
  auth,
  currentUser,
  chatrooms = [],
  subscribeChatrooms,
  currentChatroom,
  getChatrooms,
  joinChatroom,
  loading,
  children
}) => {
  useEffect(() => {
    getChatrooms();
  }, []);

  let { path, url } = useRouteMatch();
  let history = useHistory();
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery({ query: "(max-width: 600px)" });
  const [open, setOpen] = React.useState(true);

  const handleChatroomChange = chatroom => {
    if (currentChatroom && chatroom.id === currentChatroom.id) {
      return;
    }

    //TODO: implement change chatroom func
    joinChatroom(chatroom);
    // Better implementation?
  };

  useEffect(() => {
    subscribeChatrooms();
    if (currentChatroom) {
      history.push(`${url}chatroom/${currentChatroom._id}`);
    }
  }, [currentChatroom]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return loading ? (
    <Loader />
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
            {/* //TODO: Replace state below */}
            {isMobile
              ? currentChatroom
                ? currentChatroom
                : "Welcome!"
              : currentChatroom
              ? `Current Chatroom: ${currentChatroom.name}`
              : "Welcome!"}
          </Typography>

          <div className={classes.appBarButtons}>
            <IconButton
              aria-label="delete"
              // onClick={props.changeTheme}
              color="inherit"
              // children={
              //   props.isDarkTheme ? (
              //     <Brightness4OutlinedIcon />
              //   ) : (
              //     <BrightnessLowOutlinedIcon />
              //   )
              // }
            ></IconButton>
            {/*  Implement logout authcontroller func */}

            {/* //TODO: Implement Friends screen
            <Tooltip title="Friends">
              <IconButton
                aria-label="friends"
                color="inherit"
                onClick={() => history.push("/friends")}
                children={<PeopleAltIcon />}
              ></IconButton>
            </Tooltip> */}
            <Settings />
            <LogoutDialog />
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
          {/* //TODO: Fix state below */}
          {chatrooms.map(chatroom => (
            <div key={chatroom._id}>
              <ListItem onClick={() => handleChatroomChange(chatroom)} button>
                {/* //TODO: ADD IMAGE UPLOADS FOR CHATROOMS AND USERS */}
                {/* <ListItemAvatar>
                    <Avatar></Avatar>
                  </ListItemAvatar> */}
                <ListItemText
                  primary={chatroom.name}
                  // secondary={secondary ? "Secondary text" : null}
                />

                {chatroom.creator._id === currentUser._id && (
                  <ListItemSecondaryAction>
                    {/* <IconButton edge="end" aria-label="delete"><DeleteIcon /></IconButton> */}
                    <EditChatroom />
                    <Link
                      to={`/chatrooms/edit/${chatroom._id}`}
                      className="ui button primary"
                    ></Link>
                  </ListItemSecondaryAction>
                )}
              </ListItem>
              <Divider />
            </div>
          ))}
        </List>
        <div className={classes.addChatroomButton}>
          {/* //TODO: Fix state of below component */}
          <AddChatroomDialog />
        </div>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open
        })}
      >
        <div className={classes.drawerHeader} />
        {/* //TODO: Fix state below */}
        <Route exact path="/friends">
          <Friends />
        </Route>
        <ChatWindow />
      </main>
    </div>
  );
};

const mapStateToProps = state => ({
  auth: state.auth,
  currentUser: state.auth.currentUser,
  chatrooms: state.chatrooms.chatrooms,
  loading: state.chatrooms.loading,
  currentChatroom: state.chatrooms.currentChatroom
});

export default connect(mapStateToProps, {
  getChatrooms,
  joinChatroom,
  subscribeChatrooms
})(Dashboard);
