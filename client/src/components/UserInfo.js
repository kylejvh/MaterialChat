import React from "react";
import { connect } from "react-redux";
import {
  usePopupState,
  bindToggle,
  bindPopper,
} from "material-ui-popup-state/hooks";
import Fade from "@material-ui/core/Fade";

import { withStyles } from "@material-ui/core/styles";
import Popper from "@material-ui/core/Popper";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";

import { makeStyles } from "@material-ui/core/styles";

import Typography from "@material-ui/core/Typography";

import TextField from "@material-ui/core/TextField";

import InputAdornment from "@material-ui/core/InputAdornment";
import AccountCircle from "@material-ui/icons/AccountCircle";

// const useStyles = makeStyles(theme => ({
//   root: {
//     width: "100%"
//   },
//   heading: {
//     fontSize: theme.typography.pxToRem(15),
//     flexBasis: "33.33%",
//     flexShrink: 0
//   },
//   secondaryHeading: {
//     fontSize: theme.typography.pxToRem(15),
//     color: theme.palette.text.secondary
//   }
// }));

const useStyles = makeStyles((theme) => ({
  paper: {
    border: "1px solid",
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
  },
}));

const UserInfo = ({ isOpen, anchorEl }) => {
  const popupState = usePopupState({
    variant: "popper",
    popupId: "demoPopper",
  });
  const classes = useStyles();
  // const [anchorEl, setAnchorEl] = React.useState(null);

  // const handleClose = () => {
  //   setAnchorEl(null);
  // };

  // const handleClose = (event, reason) => {
  //   if (reason === "clickaway") {
  //     return;
  //   }

  //   setOpen(false);
  // };

  const id = isOpen ? "simple-popper" : undefined;

  return (
    <Popper
      id={id}
      anchorEl={anchorEl}
      open={isOpen}
      // onClose={handleClose}
    >
      <Card className={classes.root}>
        <CardContent>
          <Typography
            className={classes.title}
            color="textSecondary"
            gutterBottom
          >
            Word of the Day
          </Typography>
          <Typography variant="h5" component="h2"></Typography>
          <Typography className={classes.pos} color="textSecondary">
            adjective
          </Typography>
          <Typography variant="body2" component="p"></Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Learn More</Button>
        </CardActions>
      </Card>
    </Popper>
  );
};

export default connect(null)(UserInfo);
