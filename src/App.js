import React from "react";

import Dashboard from "./Dashboard";
import Store from "./Store";

import { ThemeProvider } from "@material-ui/core/styles";
import { createMuiTheme } from "@material-ui/core/styles";

// Your goal should be to eventually replace the socket.io implementation and use a backend like Nodejs to do something interesting with this project...

const darkTheme = createMuiTheme({
  palette: {
    type: "dark"
  }
});

const App = () => {
  return (
    <ThemeProvider>
      <Store>
        <Dashboard />
      </Store>
    </ThemeProvider>
  );
};

export default App;
