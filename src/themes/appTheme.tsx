import {createTheme} from "@mui/material"
import {PRIMARY_COLOR, SECONDARY_COLOR} from "./constants"

const appTheme = createTheme({
  palette: {
    primary: {
      main: PRIMARY_COLOR,
    },
    secondary: {
      main: SECONDARY_COLOR,
    },
  },
})

export default appTheme