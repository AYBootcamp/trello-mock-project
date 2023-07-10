import { CircularProgress } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useCallback, useEffect, useLayoutEffect } from 'react'

import { updateWidth, updateXOffset } from '../redux/appSlice'
import {
    fetchCardByBoardId,
    isCardLoading as isCardLoadingSelector,
} from '../redux/cardSlice'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import {
    fetchListByBoardId,
    isListLoading as isListLoadingSelector,
} from '../redux/listSlice'
import {
    fetchListOrder,
    isListOrderLoading as isListOrderLoadingSelector,
} from '../redux/orderSlice'
import { ALEX_BOARD_ID } from '../secrets'
import Navbar from './Navbar'
import Snackbar from './Snackbar'

const FullScreenContainer = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    height: '100vh',
}))

const ChildrenWrapper = styled('div')``

const PageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dispatch = useAppDispatch()
    const isCardLoading = useAppSelector(isCardLoadingSelector)
    const isListLoading = useAppSelector(isListLoadingSelector)
    const isListOrderLoading = useAppSelector(isListOrderLoadingSelector)
    const isDataLoading = isCardLoading || isListLoading || isListOrderLoading

    const fetchData = useCallback(async () => {
        await Promise.all([
            dispatch(fetchListByBoardId(ALEX_BOARD_ID)),
            dispatch(fetchCardByBoardId(ALEX_BOARD_ID)),
            dispatch(fetchListOrder(ALEX_BOARD_ID)),
        ])
    }, [dispatch])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    useLayoutEffect(() => {
        const updateSize = () => {
            dispatch(updateWidth(window.innerWidth))
        }

        const updateOffset = () => {
            dispatch(updateXOffset(window.scrollX))
        }

        updateSize()
        updateOffset()
        window.addEventListener('resize', updateSize)
        window.addEventListener('scroll', updateOffset)
        return () => {
            window.removeEventListener('resize', updateSize)
            window.removeEventListener('scroll', updateOffset)
        }
    }, [dispatch])

    return (
        <FullScreenContainer>
            <Navbar />
            <ChildrenWrapper>
                {isDataLoading ? <CircularProgress /> : children}
            </ChildrenWrapper>
            <Snackbar />
        </FullScreenContainer>
    )
}

export default PageLayout
