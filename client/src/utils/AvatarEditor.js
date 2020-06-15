import React, { useState, createRef } from "react";
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
  uploadFormButton: {
    margin: theme.spacing(1),
    marginBottom: 0,
  },
}));

const PhotoUpload = ({ updateUserData, handleNext, handleSkip }) => {
  const classes = useStyles();
  const dropzoneRef = createRef();
  const editorRef = createRef();

  const [file, setFile] = useState(null);
  const [imageValues, setImageValues] = useState({
    scale: 1,
    rotation: 0,
  });

//   const onSubmit = (e) => {
//     e.preventDefault();

//     if (editorRef.current) {
//       // Takes edited image data, converts to blob, and sends to backend as formdata.
//       const canvas = editorRef.current.getImage();
//       canvas.toBlob(function (imgBlob) {
//         const formData = new FormData();
//         formData.append("photo", imgBlob, "avatar.jpg");

//         updateUserData(formData, handleNext);
//       }, "image/jpeg");
//     }
//   };

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

<Grid
  container
  direction="column"
  alignItems="center"
  className={classes.uploadContainer}
>
  <Typography gutterBottom>
    Drag and drop or click the new image button to add an avatar.
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
</Grid>;
