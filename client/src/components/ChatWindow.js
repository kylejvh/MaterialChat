import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  subscribeMessages,
  sendMessage,
  emitMessage
} from "../actions/message";
import { subscribeTyping, emitTyping } from "../actions/notify";

import { makeStyles } from "@material-ui/core/styles";
import { useMediaQuery } from "react-responsive";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";

import Tooltip from "@material-ui/core/Tooltip";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListSubheader from "@material-ui/core/ListSubheader";
import Chip from "@material-ui/core/Chip";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import TextField from "@material-ui/core/TextField";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import IconButton from "@material-ui/core/IconButton";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ListIcon from "@material-ui/icons/List";

const useStyles = makeStyles(theme => ({
  "@global": {
    "*::-webkit-scrollbar": {
      width: "0.4em"
    },
    "*::-webkit-scrollbar-track": {
      "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,0.00)"
    },
    "*::-webkit-scrollbar-thumb": {
      backgroundColor: theme.palette.primary.main,
      outline: "3px solid slategrey"
    }
  },
  content: {
    padding: 0
  },
  root: {
    display: "flex",
    padding: "0",
    height: "85vh",

    "@media (max-width: 600px)": {
      height: "89vh"
    }
  },
  chatContainer: {
    display: "flex",
    flexFlow: "column",
    flex: "1",
    margin: ".5em 1em 0 1em",

    "@media (max-width: 600px)": {
      margin: "1em 0"
    }
  },
  chatMessageWindow: {
    border: "1px solid #ccc",
    borderRadius: "3px",
    // margin: ".5em",
    flex: "1",
    fontSize: "13px",

    overflowY: "auto",
    padding: "4px",

    "@media (max-width: 600px)": {
      border: "none",
      borderRadius: "0",
      padding: "0"
    }
  },
  chatBar: {
    display: "flex",
    margin: "1em 0",
    alignSelf: "flex-end",

    "@media (max-width: 600px)": {
      margin: "0"
    }
  },
  chatBarInput: {},
  chatSendButton: {},
  userListPanel: {
    flex: "0 1",
    alignSelf: "flex-start"
  },
  userListIcon: {
    marginRight: "0.5em"
  },
  mobileUserList: {
    margin: "1em"
  },
  UserListDivider: {
    width: "100%"
  },
  typing: {
    margin: "1rem"
  },
  chatMessage: {
    fontSize: "1rem",
    margin: "0 0 .5rem .5rem"
  },
  chatMessageWrapper: {
    display: "flex",
    flexDirection: "column"
  },
  fromUserBubble: {
    marginBottom: ".5rem"
  },
  chatDivider: {
    width: "100%",
    marginBottom: "1rem"
  }
}));

const ChatWindow = ({
  currentChatroom = null,
  user,
  messages,
  subscribeMessages,
  emitMessage,
  sendMessage,
  theme,
  subscribeTyping,
  usersTyping,
  emitTyping
}) => {
  const [chatMessage, setChatMessage] = useState("");
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    if (currentChatroom) {
      subscribeMessages();
      subscribeTyping();
    }
  }, [currentChatroom]);

  const [drawer, setDrawer] = useState(false);
  const classes = useStyles(theme);

  const handleUserClick = event => {
    setShowUserInfo(!showUserInfo);
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const isMobile = useMediaQuery({ query: "(max-width: 600px)" });
  let messagesEndRef = React.useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const onInputChange = e => {
    setChatMessage(e.target.value);
    // e.target.value === ""
    //   ? emitTyping({ user, typing: false })
    //   : emitTyping({ user, typing: true });
  };

  const onSubmit = e => {
    e.preventDefault();
    if (chatMessage) {
      let data = {
        sender: {
          username: user
        },
        message: chatMessage,
        timestamp: Date.now()
      };
      sendMessage(data);
      emitMessage(data);
    }
    setChatMessage("");
  };

  React.useEffect(scrollToBottom, [messages]);

  return currentChatroom ? (
    <div className={classes.root}>
      <div className={classes.chatContainer}>
        <div className={classes.chatMessageWindow}>
          <List>
            {/* //TODO: REIMPLEMENT MESSAGES */}
            {currentChatroom &&
              messages.map((message, i) => (
                <div className={classes.chatMessageWrapper} key={i}>
                  <ListItem alignItems="flex-start">
                    {/* //TODO: Implement Avatar upload, and usercard popper onclick...
                  <ListItemAvatar>
                    <Avatar
                    //  onClick={handleUserClick}
                    />
                  </ListItemAvatar> */}
                    <Chip
                      className={classes.fromUserBubble}
                      label={(message.sender && message.sender.username) || ""}
                      size="small"
                      color={message.sender === user ? "primary" : "secondary"}
                      onClick={event => handleUserClick(event)}
                    ></Chip>

                    {/* //TODO: Implement Usercard popper
                  <UserInfo anchorEl={anchorEl} isOpen={showUserInfo} /> */}
                    {/* //TODO: Implement Popper to edit/delete message...
                  <ListItemIcon>
                    <Tooltip title="Edit Message">
                      <IconButton
                        aria-label="Edit Message"
                        color="inherit"
                        // onClick={() => history.push("/friends")}
                        children={<MoreHorizIcon />}
                      ></IconButton>
                    </Tooltip>
                  </ListItemIcon> */}
                    <Typography className={classes.chatMessage} variant="body1">
                      {message.message}
                    </Typography>
                    {/* <Divider className={classes.chatDivider} component="li" /> */}
                  </ListItem>
                </div>
              ))}
            <div
              style={{ float: "left", clear: "both", paddingBottom: "2em" }}
              ref={messagesEndRef}
            >
              {/* //TODO: FIX TYPING */}

              {usersTyping &&
                usersTyping.map((user, i) => (
                  <i key={i} className={classes.typing}>
                    {user} is typing...
                  </i>
                ))}
            </div>
          </List>
        </div>
        <form onSubmit={e => onSubmit(e)}>
          <div className={classes.chatBar}>
            {isMobile && (
              <IconButton
                onClick={() => setDrawer(true)}
                size="small"
                className={classes.userListIcon}
              >
                <ListIcon color="inherit" />
              </IconButton>
            )}

            <TextField
              autoFocus
              className={classes.chatBarInput}
              label="Send a message"
              variant="outlined"
              value={chatMessage}
              fullWidth
              onChange={e => onInputChange(e)}
            />
            <Button
              className={classes.chatBarSend}
              type="submit"
              variant="outlined"
            >
              Send
            </Button>
          </div>
        </form>
      </div>
      {isMobile ? (
        <div>
          <SwipeableDrawer
            anchor="right"
            open={drawer}
            onClose={() => setDrawer(false)}
            onOpen={() => setDrawer(true)}
          >
            <div className={classes.mobileUserList} role="presentation">
              <List
                dense
                subheader={
                  <ListSubheader component="div" id="nested-list-subheader">
                    {/* {currentChatroom}  */}
                    Users:
                  </ListSubheader>
                }
              >
                //TODO: GET USERSINCHATROOM WORKING
                {/* {usersInChatroom.map((user, i) => (
                  <div key={i}>
                    <ListItem>
                      {user === username && <PermIdentityIcon />}
                      <ListItemText primary={user} />
                    </ListItem>
                    <Divider component="li" />
                  </div>
                ))} */}
              </List>
            </div>
          </SwipeableDrawer>
        </div>
      ) : (
        <ExpansionPanel className={classes.userListPanel}>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="currentuserpanel-content"
            id="currentuserpanel-header"
          >
            <Typography className={classes.heading}>
              {/* {currentChatroom} */}
              Users:
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <List dense>
              //TODO: GET USERSINCHATROOM WORKING
              {/* {usersInChatroom.map((user, i) => (
                <div key={i}>
                  <ListItem>
                    {user === username && <PermIdentityIcon />}
                    <ListItemText primary={user} />
                  </ListItem>
                  <Divider component="li" />
                </div>
              ))} */}
            </List>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      )}
    </div>
  ) : (
    <Typography variant="h5" component="h5">
      Hello, {user}. Join a chatroom to Chat!
    </Typography>
  );
};

const mapStateToProps = state => ({
  messages: state.message.messages,
  user: state.auth.currentUser.username,
  currentChatroom: state.chatrooms.currentChatroom,
  usersTyping: state.notify.usersTyping
});

export default connect(mapStateToProps, {
  subscribeMessages,
  sendMessage,
  emitMessage,
  subscribeTyping,
  emitTyping
})(ChatWindow);
