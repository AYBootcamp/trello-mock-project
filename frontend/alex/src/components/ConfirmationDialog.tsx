import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material'

interface ConfirmationDialogProps {
    open: boolean
    title?: string
    desc?: string
    handleClose: () => void
    handleConfirm: () => void
}
const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
    open,
    title,
    desc,
    handleClose,
    handleConfirm,
}) => {
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{title ?? 'Are you sure?'}</DialogTitle>
            {desc && (
                <DialogContent>
                    <DialogContentText>{desc}</DialogContentText>
                </DialogContent>
            )}
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleConfirm} autoFocus>
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ConfirmationDialog
