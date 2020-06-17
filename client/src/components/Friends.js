import React, { useState } from "react";
import { connect } from "react-redux";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  details: {
    alignItems: "center",
  },
  column: {
    flexBasis: "33.33%",
  },
}));

const Friends = ({}) => {
  const classes = useStyles();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Paper className={classes.root}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="All Friends" />
          <Tab label="Online" />
          <Tab label="Pending" />
          <Tab label="Add Friends"></Tab>
        </Tabs>
      </Paper>
    </>
  );
};

const mapStateToProps = ({ auth }) => ({
  currentUsername: auth.currentUser.username,
  currentEmail: auth.currentUser.email,
});

export default connect(mapStateToProps)(Friends);
