import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { ThemeProvider } from "@material-ui/core/styles";
import { createMuiTheme } from "@material-ui/core/styles";
import { getUser } from "./actions/auth";
import store from "./store";
import Routes from "./clientroutes/Routes";

const lightTheme = createMuiTheme({
  palette: {
    type: "light",
    primary: {
      main: "#b43bba",
    },
  },
});

const darkTheme = createMuiTheme({
  palette: {
    primary: {
      main: "#27bf7f",
    },
    secondary: {
      main: "#249da5",
    },
    type: "dark",
  },
});

const App = () => {
  useEffect(() => {
    // Check if user was previously authenticated with a token
    store.dispatch(getUser());
  }, []);

  const [isDarkTheme, setIsDarkTheme] = useState(true);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  return (
    <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
      <Provider store={store}>
        <Router>
          {/* <Dashboard isDarkTheme={isDarkTheme} changeTheme={toggleTheme} /> */}
          <Routes />
        </Router>
      </Provider>
    </ThemeProvider>
  );
};

export default App;
