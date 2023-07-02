import { styled, useTheme } from '@mui/material/styles'
import { useCallback, useEffect } from 'react'

import { useAppDispatch } from '../redux/hooks'
import { fetchListByBoardId } from '../redux/listSlice'
import { ALEX_BOARD_ID } from '../secrets'
import Navbar from './Navbar'

const FullScreenContainer = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    height: '100vh',
}))

const PageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const theme = useTheme()
    const dispatch = useAppDispatch()

    const fetchData = useCallback(async () => {
        await dispatch(fetchListByBoardId(ALEX_BOARD_ID))
    }, [dispatch])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return (
        <FullScreenContainer>
            <Navbar />
            {children}
        </FullScreenContainer>
    )
}

export default PageLayout
