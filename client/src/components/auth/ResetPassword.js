import React, { useState } from "react";
import { Link as RouterLink, useParams, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { Formik, Form } from "formik";
import { changeForgottenPassword } from "../../actions/auth";
import CustomFormikField from "./../../utils/formik/CustomFormikField";
import resetSchema from "./../../utils/formik/resetSchema";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
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

const ResetPassword = ({ changeForgottenPassword }) => {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const { token: resetToken } = useParams();
  const history = useHistory();

  const [passwordVisibility, setPasswordVisibility] = useState(false);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const redirectOnSuccess = () => {
    return history.push("/");
  };

  return (
    <Dialog
      className={classes.resetDialog}
      fullScreen={fullScreen}
      fullWidth
      open
      aria-labelledby="resetPassword-dialog-title"
    >
      <DialogTitle id="resetPassword-dialog-title">
        Change your password
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Set a new password and login to your account.
        </DialogContentText>
        <Formik
          initialValues={{
            password: "",
            passwordConfirm: "",
          }}
          validationSchema={resetSchema}
          validateOnBlur={false}
          onSubmit={({ password, passwordConfirm }, { setSubmitting }) => {
            changeForgottenPassword(
              {
                password,
                passwordConfirm,
                token: resetToken,
              },
              redirectOnSuccess
            );
            setSubmitting(false);
          }}
        >
          <Form>
            <CustomFormikField
              autoFocus
              label="New Password"
              fullWidth
              id="password"
              margin="normal"
              name="password"
              placeholder="New Password"
              type={passwordVisibility ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setPasswordVisibility(!passwordVisibility)}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {passwordVisibility ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <CustomFormikField
              label="Confirm New Password"
              fullWidth
              id="passwordConfirm"
              margin="normal"
              name="passwordConfirm"
              placeholder="Password"
              type={passwordVisibility ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setPasswordVisibility(!passwordVisibility)}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {passwordVisibility ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <DialogActions>
              <Button
                color="primary"
                variant="outlined"
                component={RouterLink}
                to="/login"
              >
                Cancel
              </Button>
              <Button type="submit" color="primary" variant="contained">
                Change Password
              </Button>
            </DialogActions>
          </Form>
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default connect(null, { changeForgottenPassword })(ResetPassword);
