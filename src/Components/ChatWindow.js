import React, { useContext, useState } from "react";
import { CTX } from "../Store";
import { makeStyles } from "@material-ui/core/styles";
import { useMediaQuery } from "react-responsive";

import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
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
import PermIdentityIcon from "@material-ui/icons/PermIdentity";

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
  fromUserBubble: {
    marginBottom: ".5rem"
  },
  chatDivider: {
    width: "100%",
    marginBottom: "1rem"
  }
}));

const ChatWindow = props => {
  const [drawer, setDrawer] = useState(false);
  const classes = useStyles(props.theme);

  const { state, sendChatAction, handleTyping, handleStopTyping } = useContext(
    CTX
  );

  const { chatrooms, usersInChatroom } = state;
  const { username, currentChatroom } = state.currentUser;

  const { chatMessage, setChatMessage } = props;
  const isMobile = useMediaQuery({ query: "(max-width: 600px)" });

  const newTypingHandler = () => {
    handleTyping({ userTyping: username, isTyping: true });
  };

  let messagesEndRef = React.useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  React.useEffect(scrollToBottom, [chatrooms]);

  return currentChatroom ? (
    <div className={classes.root}>
      <div className={classes.chatContainer}>
        <div className={classes.chatMessageWindow}>
          <List>
            {currentChatroom &&
              chatrooms[currentChatroom].map((chat, i) => (
                <div key={i}>
                  <Chip
                    className={classes.fromUserBubble}
                    label={chat.from}
                    size="small"
                    color={chat.from === username ? "primary" : "secondary"}
                  />

                  <Typography className={classes.chatMessage} variant="body1">
                    {chat.msg}
                  </Typography>
                  <Divider className={classes.chatDivider} component="li" />
                </div>
              ))}
            <div
              style={{ float: "left", clear: "both", paddingBottom: "2em" }}
              ref={messagesEndRef}
            >
              {state.typing.isTyping && (
                <i
                  className={classes.typing}
                >{`${state.typing.userTyping} is typing...`}</i>
              )}
            </div>
          </List>
        </div>
        <form
          onSubmit={e => {
            e.preventDefault();
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
              onChange={e => {
                setChatMessage(e.target.value);
                e.target.value === ""
                  ? handleStopTyping({ userTyping: username, isTyping: false })
                  : newTypingHandler();
              }}
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
                    {currentChatroom} Users:
                  </ListSubheader>
                }
              >
                {usersInChatroom.map((user, i) => (
                  <div key={i}>
                    <ListItem>
                      {user === username && <PermIdentityIcon />}
                      <ListItemText primary={user} />
                    </ListItem>
                    <Divider component="li" />
                  </div>
                ))}
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
              {currentChatroom} Users:
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <List dense>
              {usersInChatroom.map((user, i) => (
                <div key={i}>
                  <ListItem>
                    {user === username && <PermIdentityIcon />}
                    <ListItemText primary={user} />
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
    <Typography variant="h5" component="h5">
      Hello, {username}. Join a chatroom to Chat!
    </Typography>
  );
};

export default ChatWindow;
