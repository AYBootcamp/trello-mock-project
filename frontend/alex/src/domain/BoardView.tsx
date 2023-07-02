import { CircularProgress, Typography } from '@mui/material'
import { useSelector } from 'react-redux'

import { useAppSelector } from '../redux/hooks'
import { isListLoading } from '../redux/listSlice'

const BoardView = () => {
    const isLoading = useAppSelector(isListLoading)
    const listData = useAppSelector((state) => state.list.data)

    if (isLoading) {
        return <CircularProgress />
    }
    return (
        <div>
            <Typography>
                number of list: {Object.keys(listData).length}
            </Typography>
            <pre>{JSON.stringify(listData, null, 4)}</pre>
        </div>
    )
}

export default BoardView
