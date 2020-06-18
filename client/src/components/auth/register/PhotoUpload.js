import React, { useState, createRef, useEffect } from "react";
import { connect } from "react-redux";
import Dropzone from "react-dropzone";
import AvatarEditor from "react-avatar-editor";
import { updateUserData } from "../../../actions/auth";
import ProgressButton from "../../ProgressButton";

import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import ZoomInIcon from "@material-ui/icons/ZoomIn";
import ZoomOutIcon from "@material-ui/icons/ZoomOut";
import RotateLeftIcon from "@material-ui/icons/RotateLeft";
import RotateRightIcon from "@material-ui/icons/RotateRight";
import Grid from "@material-ui/core/Grid";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles((theme) => ({
  root: {},
  uploadContainer: {
    flex: 1,
    maxWidth: 500,
    padding: theme.spacing(2),
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
  avatarControls: {
    margin: theme.spacing(1),
  },
  controlButtonGroup: {
    margin: theme.spacing(1),
  },
  applyAvatarButton: {
    margin: theme.spacing(1),
    marginTop: 0,
    marginBottom: 0,
  },
  deleteAvatarButton: {
    margin: theme.spacing(1),
    marginTop: 0,
    marginBottom: 0,
    color: theme.palette.getContrastText(theme.palette.error.main),
    background: theme.palette.error.main,
    "&:hover": {
      background: theme.palette.error.dark,
    },
  },
}));

const PhotoUpload = ({
  handleNext = null,
  settingsPanel = false,
  updateUserData,
  currentUser,
  children,
}) => {
  const classes = useStyles();
  const dropzoneRef = createRef();
  const editorRef = createRef();

  const [file, setFile] = useState(null);
  const [imageValues, setImageValues] = useState({
    scale: 1,
    rotation: 0,
  });

  // If user is editing their avatar from settings, load current avatar.
  useEffect(() => {
    if (settingsPanel && currentUser && currentUser.photo !== "default.jpg") {
      setFile(currentUser.photo);
    }
  }, [settingsPanel, currentUser]);

  const onSubmit = (e) => {
    e.preventDefault();

    if (file && editorRef.current) {
      // Takes edited image data, converts to blob, and sends to backend as formdata.
      const canvas = editorRef.current.getImage();
      canvas.toBlob(function (imgBlob) {
        const formData = new FormData();
        formData.append("photo", imgBlob, "avatar.jpg");

        updateUserData(formData, handleNext);
      }, "image/jpeg");
    } else if (!file && settingsPanel) {
      // Handle user removing an avatar photo completely from settings screen
      updateUserData({ deletePhoto: true, photoId: currentUser.photoId });
    }
  };

  const handleAddImage = (droppedFiles) => {
    setFile(droppedFiles[0]);
  };

  const handleScaleChange = (e, newValue) => {
    setImageValues({ ...imageValues, scale: newValue });
  };

  const handleRotationChange = (e, newValue) => {
    setImageValues({ ...imageValues, rotation: newValue });
  };

  const handleImageReset = () => {
    setImageValues({ scale: 1, rotation: 0 });
  };

  const openFilePrompt = () => {
    if (dropzoneRef.current) {
      dropzoneRef.current.open();
    }
  };

  let buttonDisabledState;

  const modifyButtonDisabledState = () => {
    if (!file && currentUser && currentUser.photo === "default.jpg") {
      return (buttonDisabledState = true);
    } else if (settingsPanel) {
      return (buttonDisabledState = false);
      // } else if (!file && !settingsPanel) {
      //   return (buttonDisabledState = true);
    } else {
      return (buttonDisabledState = false);
    }
  };

  return (
    <div className={classes.root}>
      <form onSubmit={onSubmit}>
        <Grid
          container
          direction="column"
          alignItems="center"
          className={classes.uploadContainer}
        >
          <Typography gutterBottom>
            Drag and drop or use the buttons to change your avatar.
          </Typography>
          <Dropzone
            ref={dropzoneRef}
            onDrop={handleAddImage}
            noClick
            noKeyboard
            accept={["image/jpeg", "image/png", "image/bmp"]}
            maxSize={5000000}
            multiple={false}
            style={{ width: "250px", height: "250px" }}
          >
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps()}>
                <AvatarEditor
                  ref={editorRef}
                  width={250}
                  height={250}
                  image={file}
                  color={[0, 0, 0, 0.65]} // RGBA
                  scale={imageValues.scale}
                  rotate={imageValues.rotation}
                  borderRadius={500}
                />
                <input {...getInputProps()} />
              </div>
            )}
          </Dropzone>
          <div className={classes.avatarControls}>
            <ButtonGroup
              color="primary"
              aria-label="Avatar Editor Control Buttons"
              className={classes.controlButtonGroup}
            >
              <Button onClick={openFilePrompt}>New Image</Button>
              <Button onClick={handleImageReset} disabled={!file}>
                Reset
              </Button>
              <Button disabled={!file} onClick={() => setFile(null)}>
                Remove Image
              </Button>
            </ButtonGroup>

            <Typography id="avatar-zoom-slider" gutterBottom>
              Zoom
            </Typography>

            <Grid container spacing={2}>
              <Grid item>
                <ZoomOutIcon />
              </Grid>
              <Grid item xs>
                <Slider
                  value={imageValues.scale}
                  min={1}
                  max={3}
                  step={0.01}
                  onChange={handleScaleChange}
                  aria-labelledby="avatar-zoom-slider"
                />
              </Grid>
              <Grid item>
                <ZoomInIcon />
              </Grid>
            </Grid>

            <Typography id="avatar-rotation-slider" gutterBottom>
              Rotate
            </Typography>
            <Grid container spacing={2}>
              <Grid item>
                <RotateLeftIcon />
              </Grid>
              <Grid item xs>
                <Slider
                  value={imageValues.rotation}
                  min={0}
                  max={360}
                  onChange={handleRotationChange}
                  aria-labelledby="avatar-rotation-slider"
                />
              </Grid>
              <Grid item>
                <RotateRightIcon />
              </Grid>
            </Grid>
          </div>
        </Grid>
        <div>
          {children}
          {modifyButtonDisabledState()}
          <Button
            type="submit"
            color="primary"
            variant="contained"
            startIcon={
              settingsPanel && !file && currentUser.photo !== "default.jpg" ? (
                <DeleteIcon />
              ) : null
            }
            className={
              settingsPanel && !file && currentUser.photo !== "default.jpg"
                ? classes.deleteAvatarButton
                : classes.applyAvatarButton
            }
            disabled={buttonDisabledState}
          >
            {settingsPanel && !file && currentUser.photo !== "default.jpg"
              ? "Remove Avatar"
              : "Apply"}
          </Button>
        </div>
      </form>
    </div>
  );
};

const mapStateToProps = ({ auth }) => ({
  currentUser: auth.currentUser,
});

export default connect(mapStateToProps, { updateUserData })(PhotoUpload);
