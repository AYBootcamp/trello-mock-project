import { styled } from '@mui/material/styles'
import { useCallback, useEffect, useLayoutEffect } from 'react'

import { updateWidth, updateXOffset } from '../redux/appSlice'
import { fetchCardByBoardId } from '../redux/cardSlice'
import { useAppDispatch } from '../redux/hooks'
import { fetchListByBoardId } from '../redux/listSlice'
import { ALEX_BOARD_ID } from '../secrets'
import Navbar from './Navbar'

const FullScreenContainer = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    height: '100vh',
}))

const ChildrenWrapper = styled('div')``

const PageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dispatch = useAppDispatch()

    const fetchData = useCallback(async () => {
        await Promise.all([
            dispatch(fetchListByBoardId(ALEX_BOARD_ID)),
            dispatch(fetchCardByBoardId(ALEX_BOARD_ID)),
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
            <ChildrenWrapper>{children}</ChildrenWrapper>
        </FullScreenContainer>
    )
}

export default PageLayout
