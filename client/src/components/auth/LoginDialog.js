import React, { useState } from "react";
import { Link as RouterLink, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { Formik, Form } from "formik";
import { login } from "../../actions/auth";
import ProgressButton from "../ProgressButton";
import CustomFormikField from "./../../utils/formik/CustomFormikField";
import loginSchema from "./../../utils/formik/loginSchema";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Typography, Container } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Link from "@material-ui/core/Link";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

const useStyles = makeStyles((theme) => ({
  loginDialog: {
    padding: theme.spacing(3),
    [theme.breakpoints.down("sm")]: {
      padding: 0,
    },
  },
  root: {
    "& > *": {
      margin: theme.spacing(3),
    },
  },
  titleContainer: {
    padding: theme.spacing(3),
    paddingTop: "1.5em",
  },
}));

const LoginDialog = ({ login, isAuthenticated, error }) => {
  const [passwordVisibility, setPasswordVisibility] = useState(false);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  if (isAuthenticated) {
    return <Redirect to="/" />;
  }

  return (
    <Dialog
      className={classes.loginDialog}
      fullScreen={fullScreen}
      fullWidth
      open
      aria-labelledby="form-dialog-title"
    >
      <Container className={classes.titleContainer}>
        <Typography variant="h4">Hello! Welcome to MaterialChat!</Typography>
      </Container>
      <DialogTitle id="form-dialog-title">Login</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To begin messaging, please enter your email and password.
        </DialogContentText>
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={loginSchema}
          validateOnBlur={false}
          onSubmit={(values, { setSubmitting }) => {
            login(values);
            setSubmitting(false);
          }}
        >
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
              <Link component={RouterLink} to="/register">
                Don't have an account?
              </Link>
              <ProgressButton title="Login" color="primary" loading="" />
            </DialogActions>
          </Form>
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

const mapStateToProps = ({ auth, notify }) => ({
  isAuthenticated: auth.isAuthenticated,
  errors: notify.messages,
});

export default connect(mapStateToProps, { login })(LoginDialog);
