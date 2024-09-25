import theme from "@/theme/theme";
const setCSSVariables = (themeProps: typeof theme) => {
  // --text
  const root = document.documentElement;
  root.style.setProperty(
    "--text-color-primary",
    themeProps.palette.primary.main,
  );
  root.style.setProperty(
    "--text-color-secondary",
    themeProps.palette.text.secondary,
  );

  root.style.setProperty(
    "--text-color-tertiary",
    themeProps.palette.text.tertiary as string,
  );
  root.style.setProperty(
    "--text-color-quaternary",
    themeProps.palette.text.quaternary as string,
  );
  // --border
  root.style.setProperty(
    "--border-color-primary",
    themeProps.palette.border?.primary as string,
  );
  // --bg
  root.style.setProperty(
    "--bg-color-primary",
    themeProps.palette.background.primary as string,
  );
  root.style.setProperty(
    "--bg-color-secondary",
    themeProps.palette.background.secondary as string,
  );
  // --btn
  root.style.setProperty(
    "--btn-color-primary",
    themeProps.palette.primary.main as string,
  );
  root.style.setProperty(
    "--btn-color-secondary",
    themeProps.palette.button?.secondary as string,
  );
  root.style.setProperty(
    "--btn-color-tertiary",
    themeProps.palette.button?.tertiary as string,
  );
  root.style.setProperty(
    "--btn-color-quaternary",
    themeProps.palette.button?.quaternary as string,
  );
  // --toast
  root.style.setProperty(
    "--warning-color",
    themeProps.palette.toast?.warning as string,
  );
  root.style.setProperty(
    "--success-color",
    themeProps.palette.toast?.success as string,
  );
  root.style.setProperty(
    "--error-color",
    themeProps.palette.toast?.danger as string,
  );
};

export default setCSSVariables;
