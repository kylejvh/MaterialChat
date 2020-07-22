import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { subscribeMessages, sendMessage } from "../actions/message";
import { subscribeTyping, emitTyping } from "../actions/notify";
import { subscribeChatroomUsers } from "../actions/chatroom";
import { removeSocketListener } from "../socket-client/socketFunctions";
import Loader from "./notify/Loader";

import { makeStyles } from "@material-ui/core/styles";

import { useMediaQuery } from "react-responsive";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListSubheader from "@material-ui/core/ListSubheader";
import Chip from "@material-ui/core/Chip";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import IconButton from "@material-ui/core/IconButton";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ListIcon from "@material-ui/icons/List";

const useStyles = makeStyles((theme) => ({
  "@global": {
    "*::-webkit-scrollbar": {
      width: "0.4em",
    },
    "*::-webkit-scrollbar-track": {
      "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,0.00)",
    },
    "*::-webkit-scrollbar-thumb": {
      backgroundColor: theme.palette.primary.main,
      outline: "3px solid slategrey",
    },
  },
  content: {
    padding: 0,
  },
  root: {
    display: "flex",
    padding: "0",
    height: "85vh",

    "@media (max-width: 600px)": {
      height: "89vh",
    },
  },
  chatContainer: {
    display: "flex",
    flexFlow: "column",
    flex: "1",
    margin: ".5em 1em 0 1em",

    "@media (max-width: 600px)": {
      margin: "1em 0",
    },
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
      padding: "0",
    },
  },
  chatBar: {
    display: "flex",
    margin: "1em 0",
    alignSelf: "flex-end",

    "@media (max-width: 600px)": {
      margin: "0",
    },
  },
  chatBarInput: {},
  chatSendButton: {},
  userListPanel: {
    flex: "0 1",
    alignSelf: "flex-start",
  },
  userListIcon: {
    marginRight: "0.5em",
  },
  mobileUserList: {
    margin: "1em",
  },
  UserListDivider: {
    width: "100%",
  },
  typing: {
    margin: "1rem",
  },
  chatMessageInitial: {
    paddingLeft: "80px",
    marginLeft: "-72px",
  },
  chatMessageSequential: {
    paddingLeft: "64px",
  },
  chatAvatar: {
    margin: 0,
  },
  chatMessageWrapper: {
    display: "flex",
    flexDirection: "column",
  },
  fromUserBubble: {
    marginBottom: ".5rem",
    maxWidth: "fit-content",
  },
  chatDivider: {
    width: "100%",
    marginBottom: "1rem",
  },
}));

const ChatWindow = ({
  currentChatroom = null,
  currentUser,
  messages,
  loading,
  subscribeMessages,
  sendMessage,
  theme,
  subscribeTyping,
  usersTyping,
  subscribeChatroomUsers,
  activeUsers,
  emitTyping,
  removeSocketListener,
}) => {
  const [chatMessage, setChatMessage] = useState("");
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    if (currentChatroom) {
      subscribeMessages();
      subscribeChatroomUsers();
      subscribeTyping();
    }

    return () => {
      removeSocketListener("CHAT_MESSAGE_RECEIVED");
      removeSocketListener("CHATROOM_USERLIST_UPDATED");
      removeSocketListener("TYPING");
    };
  }, [
    currentChatroom,
    subscribeMessages,
    subscribeChatroomUsers,
    subscribeTyping,
  ]);

  useEffect(() => {
    let typingTimeout;
    if (currentChatroom && chatMessage !== "") {
      clearTimeout(typingTimeout);
      typingTimeout = setTimeout(() => {
        emitTyping({
          user: currentUser.username,
          chatroom: currentChatroom.id,
          typing: true,
        });
      }, 1000);
    } else if (currentChatroom && chatMessage === "") {
      clearTimeout(typingTimeout);
      emitTyping({
        user: currentUser.username,
        chatroom: currentChatroom.id,
        typing: false,
      });
    }
    return () => clearTimeout(typingTimeout);
  }, [currentChatroom, chatMessage, currentUser, emitTyping]);

  const [drawer, setDrawer] = useState(false);
  const classes = useStyles(theme);

  const handleUserClick = (event) => {
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

  const onInputChange = (e) => {
    setChatMessage(e.target.value);

    // if (e.target.value === "") {
    //   clearTimeout(typingTimeout);
    //   // emitTyping({ user, chatroom: currentChatroom.id, typing: false });
    // } else {
    //   typingTimeout = setTimeout(() => 1500);
    // }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (chatMessage) {
      sendMessage({
        sender: currentUser._id,
        sentChatroomId: currentChatroom.id,
        message: chatMessage,
      });
    }
    setChatMessage("");
  };

  React.useEffect(scrollToBottom, [messages]);

  const renderWithNewSender = (message) => (
    <>
      <ListItemAvatar className={classes.chatAvatar}>
        <Avatar
          alt="Your Avatar"
          src={
            message.sender.photo !== "default.jpg" ? message.sender.photo : null
          }
          // className={classes.userAvatar}
        >
          {message.sender.photo === "default.jpg" &&
            `${message.sender.username.charAt(0)}`}
        </Avatar>
      </ListItemAvatar>
      <div

      // style={{ paddingLeft: "72px", marginLeft: "-72px" }}
      >
        <Chip
          className={classes.fromUserBubble}
          label={message?.sender?.username || ""}
          size="small"
          color={
            message.sender.username === currentUser.username
              ? "primary"
              : "secondary"
          }
          onClick={(event) => handleUserClick(event)}
        ></Chip>
        <Typography className={classes.chatMessageInitial} variant="body1">
          {message.message}
        </Typography>
      </div>
    </>
  );

  const renderWithSameSender = (message) => (
    <Typography className={classes.chatMessageSequential} variant="body1">
      {message.message}
    </Typography>
  );

  // Need to either memoize or come up with a better method. Every time you type it's rerendering i think.

  //! Not currently working, render order broken
  const renderMessages = (messages, message, i) => {
    const prevSender = messages[i - 1]?.sender.username;
    if (i === 0) {
      return renderWithNewSender(message);
    }
    // Compare messages after intial and render new/successive conditionally
    switch (messages[i - 1]?.sender?._id) {
      case message?.sender?._id:
        return renderWithSameSender(message);
      case !message?.sender?._id:
        return renderWithNewSender(message);
      default:
        return renderWithNewSender(message);
    }
  };

  // switch (message) {
  //   case message[0] || message[i - 1].sender._id !== message.sender._id:
  //     return renderWithNewSender;
  //   case message[i - 1] && message[i - 1].sender._id === message.sender._id:
  //     return renderWithSameSender;
  //   default:
  //     renderWithNewSender;
  // }

  // If there was a last message (message[i-1]) and the last message was sent by the current message's sender, rendersameSender
  // If

  return currentChatroom && !loading ? (
    <div className={classes.root}>
      <div className={classes.chatContainer}>
        <div className={classes.chatMessageWindow}>
          <List>
            {messages?.map((message, i) => (
              <div className={classes.chatMessageWrapper} key={message._id}>
                <ListItem alignItems="flex-start">
                  {message && renderMessages(messages, message, i)}
                </ListItem>
              </div>
            ))}

            <div
              style={{ float: "left", clear: "both", paddingBottom: "2em" }}
              ref={messagesEndRef}
            >
              {usersTyping &&
                usersTyping.map((user, i) => (
                  <i key={i} className={classes.typing}>
                    {user} is typing...
                  </i>
                ))}
            </div>
          </List>
        </div>
        <form onSubmit={(e) => onSubmit(e)}>
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
              onChange={(e) => onInputChange(e)}
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
                    Users:
                  </ListSubheader>
                }
              >
                {activeUsers.map(({ _id: userId, username }) => (
                  <div key={userId}>
                    <ListItem>
                      <ListItemText primary={username} />
                    </ListItem>
                    <Divider component="li" />
                  </div>
                ))}
              </List>
            </div>
          </SwipeableDrawer>
        </div>
      ) : (
        <ExpansionPanel
          className={classes.userListPanel}
          defaultExpanded={true}
        >
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="currentuserpanel-content"
            id="currentuserpanel-header"
          >
            <Typography className={classes.heading}>Users:</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <List dense>
              {activeUsers.map(({ _id: userId, username }) => (
                <div key={userId}>
                  <ListItem>
                    <ListItemText primary={username} />
                  </ListItem>
                  <Divider component="li" />
                </div>
              ))}
            </List>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      )}
    </div>
  ) : (
    <Loader />
    // <Typography variant="h5" component="h5">
    //   Hello, {currentUser.username}. Join a chatroom to Chat!
    // </Typography>
  );
};

const mapStateToProps = (state) => ({
  messages: state.message.messages,
  loading: state.message.loading,
  currentUser: state.auth.currentUser,
  currentChatroom: state.chatrooms.currentChatroom,
  activeUsers: state.chatrooms.activeUsers,
  usersTyping: state.notify.usersTyping,
});

export default connect(mapStateToProps, {
  subscribeMessages,
  sendMessage,
  subscribeTyping,
  subscribeChatroomUsers,
  emitTyping,
  removeSocketListener,
})(ChatWindow);
