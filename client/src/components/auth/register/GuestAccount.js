import React, { useEffect } from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { connect } from "react-redux";

import { registerGuestAccount } from "../../../actions/auth";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(3),
    },
  },
  resetDialog: {
    padding: theme.spacing(3),
    [theme.breakpoints.down("sm")]: {
      padding: 0,
    },
  },
}));

const GuestAccount = ({
  currentUser,
  isAuthenticated,
  registerGuestAccount,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const history = useHistory();

  useEffect(() => {
    if (currentUser && isAuthenticated) {
      return history.push("/");
    }
  }, [currentUser, isAuthenticated, history]);

  return (
    <Dialog
      className={classes.resetDialog}
      fullScreen={fullScreen}
      fullWidth
      open
      aria-labelledby="resetPassword-dialog-title"
    >
      <DialogTitle id="resetPassword-dialog-title">
        Temporary Guest Account
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          You can choose to create a temporary guest account to easily demo the
          app.
        </DialogContentText>

        <DialogContentText>
          Your login access will expire in 30 minutes. Register an account for
          full access.
        </DialogContentText>

        <DialogActions>
          <Button
            color="primary"
            variant="outlined"
            component={RouterLink}
            to="/register"
          >
            Register Full Account
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={registerGuestAccount}
          >
            Continue
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

const mapStateToProps = ({ auth }) => ({
  isAuthenticated: auth.isAuthenticated,
  currentUser: auth.currentUser,
});

export default connect(mapStateToProps, { registerGuestAccount })(GuestAccount);
