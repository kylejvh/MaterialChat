//! follow the tut, then read Material UI docs and learn
//! how to use it, and how you want it to look, and refactor!

// set specific person to use a randomized color, or make a color picker for each person?

import React, { useState, useContext } from "react";
import { CTX } from "./Store";
import { makeStyles, useTheme } from "@material-ui/core/styles";

import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import AddIcon from "@material-ui/icons/Add";

import Button from "@material-ui/core/Button";

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

import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

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
  }, //! styles for onlinecard
  card: {
    maxWidth: 240
  },
  expand: {
    // expand icon styling
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    // expand icon styling
    transform: "rotate(180deg)"
  }
}));

const Dashboard = () => {
  const classes = useStyles();
  const theme = useTheme();

  // CTX store
  const {
    chatAppState,
    handleTyping,
    handleLogout,
    requestJoinChatroom
  } = useContext(CTX);

  const chatrooms = Object.keys(chatAppState.chatrooms);

  const [activeChatroom, setActiveChatroom] = useState(chatrooms[0]);
  const [chatMessage, setChatMessage] = useState("");
  const [userId, setUserId] = useState("");
  const [localUserIsActive, setLocalUserIsActive] = useState(false);

  const [open, setOpen] = React.useState(true);

  const handleChatroomChange = chatroom => {
    //! how to handle leaving chatroom??
    if (chatroom === activeChatroom) {
      return;
    }

    requestJoinChatroom({
      username: userId,
      chatroom
    }); // organize obj?
    setActiveChatroom(chatroom);
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

  const logout = () => {
    handleLogout({ userId });
    setUserId("");
    setLocalUserIsActive(false);
    //add disconnect and connect code here.
    // socket.connect();
  };

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
          {activeChatroom && (
            <Typography className={classes.navTitle} variant="h6" noWrap>
              Current Chatroom {activeChatroom}
            </Typography>
          )}
          <div className={classes.appBarButtons}>
            <FormControlLabel
              control={
                <Switch
                  size="small" /* checked={checked} onChange={toggleChecked} */
                />
              }
              label="Theme"
            />
            <LogoutDialog handleLogout={logout}></LogoutDialog>
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
          activeChatroom={activeChatroom}
          chatMessage={chatMessage}
          setChatMessage={setChatMessage}
          userId={userId}
        ></ChatWindow>

        {/* //! Extract to component
         */}
        <Card className={classes.card}>
          <CardContent>
            <Typography
              className={classes.title}
              color="textSecondary"
              gutterBottom
            >
              Users in Chatroom {activeChatroom}:
            </Typography>
            <IconButton
              // className={clsx(classes.expand, {
              //   [classes.expandOpen]: expanded,
              // })}
              // onClick={handleExpandClick}
              // aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </IconButton>
            {/* <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
         
        </CardContent>
      </Collapse> */}
            <List>
              {console.log(chatAppState.users, "in dashboard")}
              {chatAppState.users.map(user => {
                if (user.currentChatroom === activeChatroom) {
                  return (
                    <ListItem key={user}>
                      <ListItemText primary={user.username} />
                    </ListItem>
                  );
                }
              })}
            </List>
          </CardContent>
          {/* <CardActions>
            <Button size="small">Learn More</Button>
          </CardActions> */}
        </Card>
      </main>
    </div>
  ) : (
    <LoginForm userId={userId} setUserId={setUserId}></LoginForm>
  );
};

export default Dashboard;

// How does this actually work, if state is not preserved on the server?
// like, where are the messages actually stored?
// read the whole dev article!
