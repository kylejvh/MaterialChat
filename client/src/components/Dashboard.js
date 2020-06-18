import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  getChatrooms,
  joinChatroom,
  subscribeChatrooms,
} from "../actions/chatroom";
import { updateUserData } from "../actions/auth";
import clsx from "clsx";
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles";
import { useMediaQuery } from "react-responsive";
import ChatWindow from "./ChatWindow";
import AddChatroomDialog from "./AddChatroomDialog";
import Settings from "./Settings";
import LogoutDialog from "./auth/LogoutDialog";
import Loader from "./notify/Loader";
import EditChatroom from "./chatroom/EditChatroom";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Avatar from "@material-ui/core/Avatar";
import Badge from "@material-ui/core/Badge";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
// import BrightnessLowOutlinedIcon from "@material-ui/icons/BrightnessLowOutlined";
// import Brightness4OutlinedIcon from "@material-ui/icons/Brightness4Outlined";

const drawerWidth = 240;
const mobileDrawerWidth = 120;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },

  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),

    "@media (max-width: 600px)": {
      width: `calc(100% - ${mobileDrawerWidth}px)`,
      marginLeft: mobileDrawerWidth,
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
  },
  appBarButtons: {
    justifyContent: "flex-end",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,

    "@media (max-width: 600px)": {
      width: mobileDrawerWidth,
    },
  },
  drawerPaper: {
    width: drawerWidth,

    "@media (max-width: 600px)": {
      width: mobileDrawerWidth,
    },
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,

    "@media (max-width: 600px)": {
      marginLeft: -mobileDrawerWidth,
    },
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  navTitle: {
    flexGrow: 1,
  },
  addChatroomButton: {
    display: "flex",
    alignItems: "flex-end",
    flex: "1",
  },
  userAvatar: {
    border: "2px solid currentColor",
  },
}));

const StyledBadge = withStyles((theme) => ({
  badge: {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "$ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}))(Badge);

const Dashboard = ({
  currentUser,
  chatrooms = [],
  subscribeChatrooms,
  currentChatroom,
  getChatrooms,
  updateUserData,
  joinChatroom,
  loading,
}) => {
  useEffect(() => {
    getChatrooms();
  }, [getChatrooms]);

  let history = useHistory();
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery({ query: "(max-width: 600px)" });
  const [open, setOpen] = React.useState(true);

  const handleChatroomChange = (chatroom) => {
    if (currentChatroom && chatroom.id === currentChatroom.id) {
      return;
    }

    updateUserData({ currentChatroom: chatroom.id, type: "chatroom" });
    joinChatroom(chatroom);
  };

  useEffect(() => {
    subscribeChatrooms();
    if (currentChatroom) {
      return history.push(`/chatroom/${currentChatroom._id}`);
    }
  }, [subscribeChatrooms, currentChatroom, history]);

  const headerTitle = currentChatroom
    ? `Current Chatroom: ${currentChatroom.name}`
    : "MaterialChat";
  const mobileHeaderTitle = currentChatroom
    ? currentChatroom.name
    : "MaterialChat";

  return loading ? (
    <Loader />
  ) : (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => setOpen(true)}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography className={classes.navTitle} variant="h6" noWrap>
            {isMobile ? mobileHeaderTitle : headerTitle}
          </Typography>

          <div className={classes.appBarButtons}>
            {/* <IconButton
              aria-label="Dark or Light Theme Toggle"
              // onClick={props.changeTheme}
              color="inherit"
              children={
                props.isDarkTheme ? (
                  <Brightness4OutlinedIcon />
                ) : (
                  <BrightnessLowOutlinedIcon />
                )
              }
            ></IconButton> */}
            <StyledBadge
              overlap="circle"
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              variant="dot"
            >
              <Avatar
                alt="Your Avatar"
                src={
                  currentUser.photo !== "default.jpg" ? currentUser.photo : null
                }
                className={classes.userAvatar}
              >
                {currentUser.photo === "default.jpg" &&
                  `${currentUser.username.charAt(0)}`}
              </Avatar>
            </StyledBadge>

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
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={() => setOpen(false)}>
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
          {chatrooms.map((chatroom) => (
            <div key={chatroom._id}>
              <ListItem button onClick={() => handleChatroomChange(chatroom)}>
                <ListItemText primary={chatroom.name} />
                {chatroom.creator && chatroom.creator._id === currentUser._id && (
                  <ListItemSecondaryAction>
                    <EditChatroom />
                  </ListItemSecondaryAction>
                )}
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
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        <ChatWindow />
      </main>
    </div>
  );
};

const mapStateToProps = ({ auth, chatrooms }) => ({
  currentUser: auth.currentUser,
  chatrooms: chatrooms.chatrooms,
  loading: chatrooms.loading,
  currentChatroom: chatrooms.currentChatroom,
});

export default connect(mapStateToProps, {
  getChatrooms,
  updateUserData,
  joinChatroom,
  subscribeChatrooms,
})(Dashboard);
