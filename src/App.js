import React, { useState } from "react";

import Dashboard from "./Dashboard";
import Store from "./Store";

import { ThemeProvider } from "@material-ui/core/styles";
import { createMuiTheme } from "@material-ui/core/styles";

// Your goal should be to eventually replace the socket.io implementation and use a backend like Nodejs to do something interesting with this project...

const lightTheme = createMuiTheme({
  palette: {
    type: "light"
  }
  // {
  //   palette: {
  //     primary: {
  //       main: '#00e676',
  //     },
  //     secondary: {
  //       main: '#b9f6ca',
  //     },
  //   },
  // }
});

const darkTheme = createMuiTheme({
  palette: {
    type: "dark"
  }
});

const App = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const toggleTheme = () => {
    if (isDarkTheme) {
      setIsDarkTheme(false);
    } else {
      setIsDarkTheme(true);
    }
  };

  return (
    <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
      <Store>
        <Dashboard currentTheme={isDarkTheme} toggleTheme={toggleTheme} />
      </Store>
    </ThemeProvider>
  );
};

export default App;
