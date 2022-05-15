import React from 'react'
import './App.css'
import {Box, Typography, Link, ThemeProvider} from '@mui/material'
import ColorCanvas from "components/ColorCanvas"
import appTheme from "./themes/appTheme"

const githubUrl = 'https://github.com/Beeek3r/food-discovery' // TODO - Update URL

const App = () => {
  return (
    <ThemeProvider theme={appTheme}>
      <div className="app">
        <Box maxWidth={600} marginTop={10}>
          <Box>
            <Typography variant="h3" fontWeight='bold' color='primary' display="inline" gutterBottom>Education Horizon Group</Typography>
            <Typography variant="h5" color={'#D1D0CF'} fontWeight={600}>Coding Challenge: Colors</Typography>
          </Box>
          <Box marginTop={4} paddingX={4}>
            <Typography color={'#D1D0CF'} align='justify'>
                        You need to write a program which will produce an image in which each colour occurs exactly once (with no repetition and no used colors).
                        Colours are formed by combining a red, green, and blue component in the range of 0..256 and your program will need to break each component into
                        32 steps (8, 16, 24, 256) which means you will have 32,768 discrete colours. For the full requirements and source code, please click <Link href={githubUrl} target='_blank' color='#17E07D'>here</Link>.
            </Typography>
          </Box>
          <Box marginTop={4} paddingX={4}>
            <ColorCanvas />
          </Box>
        </Box>
      </div>
    </ThemeProvider>
  )
}

export default App
