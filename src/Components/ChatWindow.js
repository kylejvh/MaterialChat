//! This should contain everything in the main content area.
//! H1 that says topic at top
//! chatwindow
//! chatbar+send functionality...

import React, { useContext } from "react";
import { CTX } from "../Store";
import { makeStyles, useTheme } from "@material-ui/core/styles";

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles({
  root: {
    display: "flex",
    width: "90%"
  },
  chatMessageWindow: {
    width: "400px",
    height: "200px"
  },
  friendsWindow: {
    width: "30%",
    height: "300px",
    borderRight: "1px solid grey"
  },
  chatBar: {
    display: "flex",
    width: "60%",
    position: "fixed",
    bottom: "3rem"
  },
  chatBarInput: {
    width: "100%"
  },
  chatSendButton: {},
  userListPanel: {
    maxWidth: 240,
    position: "fixed",
    top: "5rem",
    right: "1rem"
  }
});

const ChatWindow = props => {
  const classes = useStyles();
  const theme = useTheme();

  const {
    chatAppState,
    sendChatAction,
    handleTyping,
    handleStopTyping
  } = useContext(CTX);

  const { chatrooms, usersInChatroom } = chatAppState;
  const { username, currentChatroom } = chatAppState.currentUser;

  const { chatMessage, setChatMessage } = props;

  // const messageInput = document.getElementById("chatfield");
  // const typing = document.getElementById("typing");
  // if someone is typing.
  // emit: userID is typing:

  //! Consider changing typing event handlers and how you would do this to implement onstoptyping...
  // messageInput.addEventListener("keypress", () => {
  //   handleTyping({ IsTyping: userId });

  // });

  // const checkTyping = () => {

  // }

  //   messageInput.addEventListener("keyup", () =>  {
  //     // handleStopTyping
  // }

  // key is pressed, typing is true
  // timer is activated to set to false after 1.5s

  // key is pressed,  typing is true, then set to false from first call,
  // then called again...l
  const newTypingHandler = () => {
    // Element.addEventListener('keypress', () => {

    // instead, fire handlestoptyping in onsubmit...
    // if (chatAppState.userTyping !== true)

    // if (chatAppState.typing.isTyping === true) {
    //   clearTimeout(newTimer);
    // }

    handleTyping({ userTyping: username, isTyping: true });

    // reference func passed in from content to emit typing

    //! will I need a cleartimeout call in onsubmit?

    //! wouldn't you call typingTimeout()?
  };

  return currentChatroom ? (
    <Container className={classes.root}>
      {/* {currentChatroom === "" && (
        
      )} */}
      {console.log(username, "state changed")}
      <List>
        {currentChatroom &&
          chatrooms[currentChatroom].map((chat, i) => (
            <div className={classes.chatWindow} key={i}>
              <Chip
                // icon={<FaceIcon />}
                label={chat.from}
                variant="outlined"
              />
              <Typography variant="body1">{chat.msg}</Typography>
            </div>
          ))}
      </List>
      {chatAppState.typing.isTyping && (
        <i>
          {`${chatAppState.typing.userTyping} is typing...`}
          {console.log("user", chatAppState)}
        </i>
      )}

      <ExpansionPanel className={classes.userListPanel}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="currentuserpanel-content"
          id="currentuserpanel-header"
        >
          <Typography className={classes.heading}>
            Users in {currentChatroom}:
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <List dense>
            {usersInChatroom.map(user => (
              <ListItem key={user}>
                <ListItemText primary={user} />
              </ListItem>
            ))}
          </List>
        </ExpansionPanelDetails>
      </ExpansionPanel>

      <div className={classes.chatBar}>
        <TextField
          autoFocus
          className={classes.chatBarInput}
          label="Send a message"
          variant="outlined"
          value={chatMessage}
          onChange={e => {
            setChatMessage(e.target.value);
            e.target.value === ""
              ? handleStopTyping({ userTyping: username, isTyping: false })
              : newTypingHandler();
            // handleTyping({ isTyping: userId }); //! Delete if working.
            // working now...
          }}
        />
        <Button
          className={classes.chatBarSend}
          variant="outlined"
          type="submit"
          onClick={() => {
            if (chatMessage) {
              sendChatAction({
                from: username,
                msg: chatMessage,
                chatroom: currentChatroom
              });
              handleStopTyping({ userTyping: username, isTyping: false });
            }
            setChatMessage("");
          }}
        >
          Send
        </Button>
      </div>
    </Container>
  ) : (
    <Typography variant="h5" component="h5">
      Hello, {username}. Join a chatroom to Chat!
    </Typography>
  );
};

export default ChatWindow;
