import React, { useState } from "react";

import Dashboard from "./Dashboard";
import Store from "./Store";

import { ThemeProvider } from "@material-ui/core/styles";
import { createMuiTheme } from "@material-ui/core/styles";

const lightTheme = createMuiTheme({
  palette: {
    type: "light",
    primary: {
      main: "#b43bba"
    }
  }
});

const darkTheme = createMuiTheme({
  palette: {
    primary: {
      main: "#27bf7f"
    },
    secondary: {
      main: "#249da5"
    },
    type: "dark"
  }
});

const App = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  return (
    <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
      <Store>
        <Dashboard isDarkTheme={isDarkTheme} changeTheme={toggleTheme} />
      </Store>
    </ThemeProvider>
  );
};

export default App;
