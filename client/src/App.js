import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { ThemeProvider } from "@material-ui/core/styles";
import { defaultTheme, lightTheme } from "./utils/themes";
import { getUser } from "./actions/auth";
import store from "./store";
import Routes from "./clientroutes/Routes";

const App = () => {
  useEffect(() => {
    // Check if user was previously authenticated with a token
    store.dispatch(getUser());
  }, []);

  const [useLightTheme, setUseLightTheme] = useState(false);

  const toggleTheme = () => {
    setUseLightTheme(!useLightTheme);
  };

  return (
    <ThemeProvider theme={useLightTheme ? lightTheme : defaultTheme}>
      <Provider store={store}>
        <Router>
          <Routes toggleTheme={toggleTheme} />
        </Router>
      </Provider>
    </ThemeProvider>
  );
};

export default App;
