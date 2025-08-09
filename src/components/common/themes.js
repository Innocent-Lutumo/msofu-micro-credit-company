import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#fafafa",
      paper: "#ffffff",
    },
    primary: {
      main: "#4caf50",
    },
    secondary: {
      main: "#81c784",
    },
    headerGreen: {
      main: "#388e3c",
    },
    red: {
      main: "#ff1744",
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    primary: {
      main: "#4caf50",
    },
    secondary: {
      main: "#81c784",
    },
    headerGreen: {
      main: "#388e3c",
    },
    red: {
      main: "#ff1744",
    },
  },
});

export const drawerWidth = 240;
export const drawerWidthRight = 300;
