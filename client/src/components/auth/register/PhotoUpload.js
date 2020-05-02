import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import { connect } from "react-redux";
import ProgressButton from "../../ProgressButton";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

import Paper from "@material-ui/core/Paper";

import { updateUserData } from "../../../actions/auth";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  input: {
    display: "none",
  },
  avatarButton: {
    flex: 1,
  },

  button: {
    margin: theme.spacing(1),
  },
}));

const PhotoUpload = ({ updateUserData, currentUser, userPhoto }) => {
  const classes = useStyles();

  const [file, setFile] = useState("");
  const [filename, setFilename] = useState("Upload Avatar Photo");

  const onSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("photo", file);

    updateUserData(formData);

    // if (value !== "") {
    // }
  };

  const onChange = (e) => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };

  return (
    <div className={classes.root}>
      <form onSubmit={onSubmit}>
        <Paper square elevation={0} className={classes.dialogContainer}>
          <Typography>You're signed up, {currentUser.username}.</Typography>
          <Typography>
            Upload an optional avatar photo below. You can always change this
            later.
          </Typography>
          <input
            accept="image/*"
            className={classes.input}
            onChange={onChange}
            id="photo"
            name="photo"
            type="file"
          />
          <label htmlFor="photo">
            {/* <Button
              variant="contained"
              color="default"
              className={classes.button}
              component="span"
              startIcon={<CloudUploadIcon />}
            >
              {filename}
            </Button> */}

            <Box display="flex" flexDirection="column" justifyContent="center">
              <IconButton
                component="span"
                // className={classes.avatarButton}
              >
                {/* Read img from memory... */}
                {/* Upon pressing next, send updateMe patch req? */}

                <Avatar
                  src={userPhoto ? userPhoto : null}
                  style={{
                    margin: "10px",
                    width: "6em",
                    height: "6em",
                  }}
                  alt={currentUser.username}
                >
                  {userPhoto ? currentUser.username : <CloudUploadIcon />}
                </Avatar>
              </IconButton>

              {userPhoto && (
                <Button
                  variant="contained"
                  color="error"
                  className={classes.button}
                  onClick={() => {
                    setFile("");
                    setFilename("");

                    updateUserData({
                      public_id: currentUser.photoId,
                      deletePhoto: true,
                    });
                  }}
                >
                  Remove
                </Button>
              )}
              <ProgressButton
                title="Confirm Photo"
                type="submit"
                color="primary"
                loading=""
              />
            </Box>
          </label>
        </Paper>
      </form>
    </div>
  );
};

// upon submit of form, you need to use updateMe endpoint? ?
const mapStateToProps = (state) => {
  return {
    // currentUser: state.auth.currentUser.username,
    currentUser: state.auth.currentUser,
    userPhoto: state.auth.userPhoto,
  };
};

export default connect(mapStateToProps, { updateUserData })(PhotoUpload);
