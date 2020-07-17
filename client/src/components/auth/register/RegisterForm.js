import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { Formik, Form } from "formik";
import { makeStyles } from "@material-ui/core/styles";
import Link from "@material-ui/core/Link";
import ProgressButton from "../../ProgressButton";
import { registerAccount } from "../../../actions/auth";
import CustomFormikField from "./../../../utils/formik/CustomFormikField";
import registerSchema from "./../../../utils/formik/registerSchema";

import DialogTitle from "@material-ui/core/DialogTitle";
import { Container } from "@material-ui/core";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

const useStyles = makeStyles((theme) => ({
  titleContainer: {
    paddingTop: 0,
    paddingBottom: theme.spacing(3),
    paddingLeft: 0,
    paddingRight: 0,
  },
  title: {
    padding: 0,
  },
}));

const RegisterForm = ({ registerAccount, currentUser, handleNext }) => {
  const classes = useStyles();
  const history = useHistory();

  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const passwordInputProps = {
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
  };

  useEffect(() => {
    if (currentUser) {
      handleNext();
    }
  }, [currentUser]);

  return (
    <>
      <Container className={classes.titleContainer}>
        <DialogTitle className={classes.title} id="form-dialog-title">
          Register a MaterialChat account
        </DialogTitle>
        <Link component={RouterLink} to="/login">
          Already have an account?
        </Link>
      </Container>

      <Formik
        initialValues={{
          username: "",
          email: "",
          password: "",
          passwordConfirm: "",
        }}
        validationSchema={registerSchema}
        validateOnBlur={false}
        onSubmit={(values, { setSubmitting }) => {
          registerAccount(values);
          setSubmitting(false);
        }}
      >
        <Form>
          <CustomFormikField
            autoFocus
            fullWidth
            margin="dense"
            label="Username"
            name="username"
            type="text"
            placeholder="Username"
          />

          <CustomFormikField
            fullWidth
            margin="dense"
            name="email"
            type="email"
            label="Email"
            placeholder="Email"
          />

          <CustomFormikField
            fullWidth
            margin="dense"
            label="Password"
            name="password"
            placeholder="Password"
            type={passwordVisibility ? "text" : "password"}
            InputProps={passwordInputProps}
          />

          <CustomFormikField
            fullWidth
            margin="dense"
            label="Confirm Password"
            name="passwordConfirm"
            placeholder="Confirm Password"
            type={passwordVisibility ? "text" : "password"}
            InputProps={passwordInputProps}
          />

          <ProgressButton title="Sign Up" color="primary" loading="" />
          <ProgressButton
            title="Use Guest Account"
            type="button"
            variant="outlined"
            onClick={() => history.push("/guest")}
          />
        </Form>
      </Formik>
    </>
  );
};

const mapStateToProps = ({ auth }) => ({
  currentUser: auth.currentUser,
});

export default connect(mapStateToProps, { registerAccount })(RegisterForm);
