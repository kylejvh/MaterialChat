import React, { useState } from "react";
import { Link as RouterLink, Redirect, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { Formik, Form } from "formik";
import { login, sendForgotPassword } from "../../actions/auth";
import CustomFormikField from "./../../utils/formik/CustomFormikField";
import loginSchema from "./../../utils/formik/loginSchema";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Typography, Container } from "@material-ui/core";
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
  loginDialog: {
    padding: theme.spacing(3),
    [theme.breakpoints.down("sm")]: {
      padding: 0,
    },
  },
  titleContainer: {
    padding: theme.spacing(3),
    paddingTop: "1.5em",
  },
}));

const LoginDialog = ({
  isAuthenticated,
  login,
  sendForgotPassword,
  location,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const history = useHistory();

  const [passwordVisibility, setPasswordVisibility] = useState(false);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const { from } = location.state || { from: { pathname: "/" } };

  if (isAuthenticated) {
    return <Redirect to={from} />;
  }

  return (
    <Dialog
      className={classes.loginDialog}
      fullScreen={fullScreen}
      fullWidth
      open
      aria-labelledby="login-dialog-title"
    >
      <Container className={classes.titleContainer}>
        <Typography variant="h4">Hello! Welcome to MaterialChat!</Typography>
      </Container>
      <DialogTitle id="login-dialog-title">Login</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To begin messaging, please enter your email and password.
        </DialogContentText>
        <Formik
          initialValues={{
            email: "",
            password: "",
            forgotPassword: false,
          }}
          validationSchema={loginSchema}
          validateOnBlur={false}
          onSubmit={(
            { email, password, forgotPassword },
            { setSubmitting }
          ) => {
            if (forgotPassword) {
              sendForgotPassword({ email });
              setSubmitting(false);
            } else {
              login({ email, password });
              setSubmitting(false);
            }
          }}
        >
          {/* Expose Formik functions for forgotPassword button */}
          {({ setFieldValue, submitForm }) => (
            <Form>
              <CustomFormikField
                label="Email"
                autoFocus
                fullWidth
                id="email"
                margin="normal"
                name="email"
                type="email"
                placeholder="Email"
              />
              <CustomFormikField
                label="Password"
                fullWidth
                id="password"
                margin="normal"
                name="password"
                placeholder="Password"
                type={passwordVisibility ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() =>
                          setPasswordVisibility(!passwordVisibility)
                        }
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {passwordVisibility ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <DialogActions>
                <Button
                  color="primary"
                  variant="outlined"
                  onClick={async () => {
                    await setFieldValue("forgotPassword", true);
                    submitForm();
                  }}
                >
                  Forgot Password
                </Button>
                <Button
                  style={{ marginRight: "auto" }}
                  color="primary"
                  variant="outlined"
                  onClick={() => history.push("/guest")}
                >
                  Guest Account
                </Button>
                <Button
                  component={RouterLink}
                  variant="outlined"
                  color="primary"
                  to="/register"
                >
                  Register
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  onClick={() => setFieldValue("forgotPassword", false)}
                >
                  Login
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

const mapStateToProps = ({ auth }) => ({
  isAuthenticated: auth.isAuthenticated,
});

export default connect(mapStateToProps, { login, sendForgotPassword })(
  LoginDialog
);
