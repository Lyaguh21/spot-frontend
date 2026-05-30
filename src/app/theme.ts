import { createTheme } from "@mantine/core";

export const theme = createTheme({
  primaryColor: "primary",

  colors: {
    dimmedColor: [
      "#e4ebff78",
      "#d2dcfa78",
      "#a0b5f778",
      "#6c8df678",
      "#446af678",
      "#2e55f678",
      "#254af778",
      "#1b3cdc78",
      "#1235c578",
      "#002dad78",
    ],

    primary: [
      //3
      "#f9ebff",
      "#ebd5fc",
      "#d3a8f3",
      "#b169e8",
      "#a451e3",
      "#9737df",
      "#902ade",
      "#7d1dc6",
      "#6f18b1",
      "#60109c",
    ],

    blue: [
      //6
      "#e5f5ff",
      "#d0e5ff",
      "#a1c8fa",
      "#6faaf4",
      "#4690f0",
      "#2b80ee",
      "#1170e8",
      "#0766d5",
      "#005bbf",
      "#004eaa",
    ],
  },

  breakpoints: {
    xs: "30em",
    sm: "48em",
    md: "64em",
    lg: "74em",
    xl: "90em",
    xxl: "120em",
  },
});
