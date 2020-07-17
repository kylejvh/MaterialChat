import React from "react";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#424242",
  },
  loaderWrapper: {
    position: "absolute",
    left: "50%",
    top: "50%",
  },
}));

export default ({ showBackdrop = false }) => {
  const classes = useStyles();
  return (
    <>
      {showBackdrop ? (
        <Backdrop className={classes.backdrop} open={true}>
          <CircularProgress />
        </Backdrop>
      ) : (
        <div className={classes.loaderWrapper}>
          <CircularProgress />
        </div>
      )}
    </>
  );
};
