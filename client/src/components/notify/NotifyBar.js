import React from "react";
import { connect } from "react-redux";
import { REMOVE_NOTIFICATION } from "./../../actions/types";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const NotifyBar = ({ dispatch, type, message, isActive }) => {
  //* Types = "error" "warning" "info" "success"

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch({ type: REMOVE_NOTIFICATION });
  };

  return (
    <Snackbar open={isActive} onClose={handleClose}>
      <Alert onClose={handleClose} severity={type}>
        {message}
      </Alert>
    </Snackbar>
  );
};

const mapStateToProps = state => ({
  type: state.notify.type,
  message: state.notify.message,
  isActive: state.notify.isActive
});

export default connect(mapStateToProps)(NotifyBar);
