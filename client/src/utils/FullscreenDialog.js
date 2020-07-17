import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Slide from "@material-ui/core/Slide";

const drawerWidth = 180;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  title: {
    flex: 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: "auto",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullscreenDialog({
  dialogTitle,
  topicList = [],
  componentList = [],
  iconList = [],
  isOpen,
  handleClose,
  ariaDescriptionID,
}) {
  const classes = useStyles();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  return (
    <Dialog
      fullScreen
      open={isOpen}
      onClose={handleClose}
      TransitionComponent={Transition}
      aria-labelledby="fullscreen-dialog-title"
      aria-describedby={ariaDescriptionID}
    >
      <DialogContent>
        <div className={classes.root}>
          <CssBaseline />
          <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
              <Typography
                variant="h6"
                noWrap
                id="fullscreen-dialog-title"
                className={classes.title}
              >
                {dialogTitle}
              </Typography>
              <IconButton
                edge="end"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          {topicList && (
            <Drawer
              className={classes.drawer}
              variant="permanent"
              classes={{
                paper: classes.drawerPaper,
              }}
            >
              <Toolbar />
              <div className={classes.drawerContainer}>
                <List>
                  {topicList.map((text, index) => (
                    <ListItem
                      button
                      key={text}
                      selected={selectedIndex === index}
                      onClick={(e) => handleListItemClick(e, index)}
                    >
                      {iconList.length > 0 && (
                        <ListItemIcon>{iconList[selectedIndex]}</ListItemIcon>
                      )}
                      <ListItemText primary={text} />
                    </ListItem>
                  ))}
                </List>
                <Divider />
              </div>
            </Drawer>
          )}
          <main className={classes.content}>
            <Toolbar />
            {/* This HOC takes a list of components as props and renders each based on the selected menu item */}
            {componentList[selectedIndex]}
          </main>
        </div>
      </DialogContent>
    </Dialog>
  );
}
