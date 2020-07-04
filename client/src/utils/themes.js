import { createMuiTheme } from "@material-ui/core/styles";

export const defaultTheme = createMuiTheme({
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

export const lightTheme = createMuiTheme({
  palette: {
    type: "light",
    primary: {
      main: "#b43bba",
    },
  },
});
