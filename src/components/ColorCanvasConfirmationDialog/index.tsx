import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material"
import React from "react"

interface IColorCanvasConfirmationDialogProps {
  open: boolean,
  primaryAction: () => void,
  onClose: () => void
}

const ColorCanvasConfirmationDialog: React.FC<IColorCanvasConfirmationDialogProps> = ({open, primaryAction, onClose}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle>Download canvas</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to download this canvas?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color='info' onClick={onClose}>Cancel</Button>
        <Button color='info' variant='contained' onClick={primaryAction} autoFocus>Download</Button>
      </DialogActions>
    </Dialog>
  )
}

export default ColorCanvasConfirmationDialog