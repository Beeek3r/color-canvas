import React, {useRef, useState} from 'react'
import {
  Box,
  Button,
  ButtonGroup,
  Typography,
  IconButton,
  Slider,
  Tooltip
} from "@mui/material"

import DownloadIcon from '@mui/icons-material/Download'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import './style.css'
import ColorCanvasConfirmationDialog from "components/ColorCanvasConfirmationDialog"
import {SECONDARY_COLOR} from "../../themes/constants"

const marks = [
  {
    value: 8,
    label: '8',
  },
  {
    value: 12,
    label: '12',
  },
  {
    value: 16,
    label: '16',
  },
]

interface IRenderStatistics {
  renderTime: number
  discretePixels: number
  dimensions: string
}

const ColorCanvas: React.FC = () => {
  const canvas = useRef<HTMLCanvasElement>(null)
  const [renderStatistics, setRenderStatistics] = useState<IRenderStatistics | undefined>(undefined)
  const [showDownloadConfirmationDialog, setShowDownloadConfirmationDialog] = useState<boolean>(false)
  const [breakSize, setBreakSize] = useState<number>(8)
  const [canvasIsVisible, setCanvasIsVisible] = useState<boolean>(false)

  const handleDownloadCanvas = (): void => {
    if (canvas?.current) {
      const image = canvas.current.toDataURL()

      const tmpLink = document.createElement( 'a' )
      tmpLink.download = 'colors-canvas.png' // set the name of the download file
      tmpLink.href = image

      document.body.appendChild( tmpLink )
      tmpLink.click()
      document.body.removeChild( tmpLink )
    }

    setShowDownloadConfirmationDialog(false)
  }

  const handleRenderWithImageData = (): void => {
    paintCanvas(
      canvas.current,
      {
        renderStatisticsCallback: setRenderStatistics,
        breakSize: breakSize,
      }
    )
    setCanvasIsVisible(true)
  }

  const handleClearCanvas = (): void => {
    clearCanvas(canvas.current)
    setRenderStatistics(undefined)
    setCanvasIsVisible(false)
  }
  return (
    <Box>
      <Box sx={{display: 'flex'}}>
        <Box sx={{width: '50%'}} paddingX={1}>
          <Slider
            valueLabelDisplay="auto"
            marks={marks}
            step={4}
            color='secondary'
            min={8}
            max={16}
            style={{color: '#FFFFFF'}}
            classes={{markLabel: 'color-canvas-slider-mark-label'}}
            value={breakSize}
            onChange={(e, value) => {setBreakSize(value as number)}}
          />
        </Box>
        <Box paddingX={1}>
          <ButtonGroup>
            <Button
              sx={{margin: 'auto 10px'}}
              variant="contained"
              onClick={handleRenderWithImageData}
              size='small'
              color='primary'
            >
              Render
            </Button>
            <Tooltip title="Download canvas">
              <IconButton
                onClick={() => setShowDownloadConfirmationDialog(true)}
                disabled={!canvasIsVisible}
                sx={{visibility: canvasIsVisible ? 'visible' : 'hidden'}}
              >
                <DownloadIcon color='secondary'/>
              </IconButton>
            </Tooltip>
            <Tooltip title="Clear canvas">
              <IconButton
                onClick={handleClearCanvas}
                disabled={!canvasIsVisible}
                sx={{visibility: canvasIsVisible ? 'visible' : 'hidden'}}
              >
                <VisibilityOffIcon color='secondary'/>
              </IconButton>
            </Tooltip>
          </ButtonGroup>
        </Box>
      </Box>
      <Box marginY={4}>
        {!!renderStatistics && (
          <Typography color={SECONDARY_COLOR} marginBottom={2}>
            Render time: ~ {renderStatistics.renderTime} ms <br/>
            Discrete colors: {renderStatistics.discretePixels} <br/>
            Dimensions: {renderStatistics.dimensions} <br/>
          </Typography>
        )}
        <canvas
          id="canvas"
          width={256}
          height={128}
          ref={canvas}
        />
      </Box>
      <ColorCanvasConfirmationDialog
        open={showDownloadConfirmationDialog}
        primaryAction={handleDownloadCanvas}
        onClose={() => setShowDownloadConfirmationDialog(false)
        }/>
    </Box>
  )
}

const powerOfTwo = (number: number): boolean => {
  return Math.log2(number) % 1 === 0
}

/**
 * Paints the provided canvas HTML element with every possibly combination of RGB between (0, 255] but makes skips of <options.breakSize>
 */
const paintCanvas = (canvas: HTMLCanvasElement | null, options: {renderStatisticsCallback?: (stats: IRenderStatistics) => void, breakSize: number}): IRenderStatistics | undefined => {
  if (!canvas) {
    console.warn('Cannot retrieve canvas element')
    return
  }

  const ctx = canvas.getContext('2d')
  const canvasWidth = canvas.width
  const canvasHeight = canvas.height

  if (!ctx) {
    console.warn('Cannot retrieve canvas context')
    return
  }

  // Clear out any existing canvas
  ctx.clearRect(0, 0, canvasWidth, canvasHeight)
  const id = ctx.getImageData(0, 0, 256, 128)
  const pixels = id.data
  const t0 = new Date().getTime()
  let x = 0
  let y = 0
  let discretePixels = 0

  /*
    Loop over every possible combination of RGB but make skips of <breakSize: number> Eg: Break Size: 8
    (255, 255, 255)
    (255, 255, 247)
    (255, 255, 240)
    ...
    Then, push each individual RGB value into $id (including an alpha value, which is always defaulted to 255). $id
    is a single dimension ordered list of RGBA values for the canvas to paint.
  */
  for (let r = 255; r > 0; r-= options.breakSize) {
    for (let g = 255; g > 0; g-= options.breakSize) {
      for (let b = 255; b > 0; b-= options.breakSize) {
        if (x === 255) {
          x = 0
          y += 1
        }
        discretePixels++
        x++
        const off = (y * id.width + x) * 4
        pixels[off] = r
        pixels[off + 1] = g
        pixels[off + 2] = b
        pixels[off + 3] = 255
      }
    }
  }

  // Paints the data from $id
  ctx.putImageData(id, 0, 0)
  const t1 = new Date().getTime()
  const renderTime = (t1 - t0)
  const dimensions =  `${!powerOfTwo(options.breakSize) ? '~' : ''} 256 x ${Math.ceil(discretePixels / 256)}` // Add equivalence symbol for non log base 2 numbers for accuracy

  // Callback function that will take in some basic statistics
  if (options?.renderStatisticsCallback) {
    options?.renderStatisticsCallback({
      renderTime,
      discretePixels,
      dimensions,
    })
  }
}

/**
 * Clears the provided canvas HTML element
 */
const clearCanvas = (canvas: HTMLCanvasElement | null) => {
  if (!canvas) {
    console.warn('Cannot retrieve canvas element')
    return
  }

  const ctx = canvas.getContext('2d')
  const canvasWidth = canvas.width
  const canvasHeight = canvas.height

  if (!ctx) {
    console.warn('Cannot retrieve canvas context')
    return
  }

  ctx.clearRect(0, 0, canvasWidth, canvasHeight)
}

export default ColorCanvas