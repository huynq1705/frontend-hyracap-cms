import { createTheme } from "@mui/material";
import FontUtils from "./font-loader/FontUtils";
import palette from "./palette-common";

const fontName = "inter"; //'Exo'

declare module "@mui/material/styles" {
  interface TypeText {
    tertiary?: string;
    quaternary?: string; // Uncomment if needed
  }
  interface TypeBackground {
    primary?: string;
    secondary?: string;
    tertiary?: string;
    quaternary?: string; // Uncomment if needed
  }
  interface Palette {
    toast?: {
      [key: string]: string;
    };
    button?: {
      [key: string]: string; //
    };
    border?: {
      [key: string]: string; //
    };
  }
  interface PaletteOptions {
    toast?: {
      [key: string]: string;
    };
    button?: {
      [key: string]: string;
    };
    border?: {
      [key: string]: string; //
    };
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: palette.primary,
    },
    warning: {
      main: palette.warning.core,
    },
    secondary: {
      main: palette.secondary,
    },
    text: {
      primary: palette.textPrimary,
      secondary: palette.textSecondary,
      tertiary: palette.textTertiary,
      quaternary: palette.textQuaternary,
    },
    background: {
      primary: palette.bgPrimary,
      secondary: palette.bgSecondary,
    },
    border: {
      primary: palette.borderPrimary,
    },
    toast: {
      warning: palette.warning.core,
      success: palette.success.core,
      danger: palette.danger.core,
    },
    button: {
      secondary: palette.btnSecondary,
      tertiary: palette.btnTertiary,
      quaternary: palette.btnQuaternary,
    },
  },
  typography: {
    button: {
      textTransform: "none",
    },
    fontFamily: fontName,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: FontUtils.createFontfaceString(fontName),
    },
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: "none",
        },
      },
    },
  },
  shape: {
    borderRadius: 6,
  },
});

export default theme;
