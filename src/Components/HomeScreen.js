//! follow the tut, then read Material UI docs and learn
//! how to use it, and how you want it to look, and refactor!

// set specific person to use a randomized color, or make a color picker for each person?

import React, { useEffect, useState, useContext, useRef } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";

import Button from "@material-ui/core/Button";

import TextField from "@material-ui/core/TextField";

import { CTX } from "./Store";

import useLocalStorage from "react-use-localstorage";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

import Fab from "@material-ui/core/Fab";
// import AddIcon from "@material-ui/icons/Add";

// persistent drawer
import clsx from "clsx";

import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";

const HomeScreen = () => {
  

  return (
      {!chatAppState.activeTopic && 
        <div>
        {userId && <Typography variant="h2">Welcome, {props.?userId}!</Typography>}
        <Typography variant="h6">Please select a channel.</Typography>
        </div>
    }
  )
}

export default HomeScreen;

// How does this actually work, if state is not preserved on the server?
// like, where are the messages actually stored?
// read the whole dev article!
