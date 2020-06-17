import React from "react";
import { connect } from "react-redux";
import { REMOVE_NOTIFICATION } from "./../../actions/types";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const NotifyBar = ({ dispatch, notifications }) => {
  //* Types = "error" "warning" "info" "success"

  const handleClose = (event, reason, id) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch({ type: REMOVE_NOTIFICATION, payload: id });
  };

  return notifications.map((msg) => (
    <Snackbar open key={msg.id} onClose={(e) => handleClose(e, null, msg.id)}>
      <Alert
        onClose={(e) => handleClose(e, null, msg.id)}
        severity={msg.messageType}
      >
        {msg.message}
      </Alert>
    </Snackbar>
  ));
};

const mapStateToProps = ({ notify }) => ({
  notifications: notify.notifications,
});

export default connect(mapStateToProps)(NotifyBar);
