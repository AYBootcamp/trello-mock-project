import {
    Alert,
    AlertColor,
    Slide,
    Snackbar as MaterialSnackbar,
} from '@mui/material'

import {
    initialSnackbarState,
    snackBarStateSelector,
    updateSnackbar,
} from '../redux/appSlice'
import { useAppDispatch, useAppSelector } from '../redux/hooks'

export interface SnackbarState {
    severity?: AlertColor
    message?: string
    open: boolean
}

const Snackbar: React.FC<{}> = () => {
    const { open, severity, message } = useAppSelector(snackBarStateSelector)
    const dispatch = useAppDispatch()

    const handleClose = () => {
        dispatch(updateSnackbar(initialSnackbarState))
    }

    return (
        <MaterialSnackbar
            autoHideDuration={3000}
            open={open}
            onClose={handleClose}
            TransitionComponent={Slide}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
            <Alert severity={severity}>{message}</Alert>
        </MaterialSnackbar>
    )
}

export default Snackbar
