import { createTheme } from "@mui/material/styles";
import tailwindConfig from "../tailwind.config";

const {
  theme: {
    extend: { colors },
  },
} = tailwindConfig;

const theme = createTheme({
  palette: {
    primary: {
      main: colors["landmark-light"],
    },
    secondary: {
      main: colors["landmark-dark"],
    },
  },
});

export default theme;
