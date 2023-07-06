import AddIcon from '@mui/icons-material/Add'
import DashboardIcon from '@mui/icons-material/Dashboard'
import FilterListIcon from '@mui/icons-material/FilterList'
import SearchIcon from '@mui/icons-material/Search'
import { Input } from '@mui/material'
import Button from '@mui/material/Button'
import React from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { createList } from '../redux/listSlice'

const BackGround = styled.div`
    background-color: lavenderblush;
    font-size: x-large;
    font-family: sans-serif;
    display: flex;
    justify-content: space-between;
    & > div {
        margin: 10px;
    }
`
export default function navigation() {
    const dispatch = useDispatch()
    const addNewList = () => {
        dispatch(createList())
    }
    return (
        <BackGround>
            <div>
                <DashboardIcon color="secondary" />
                Trello
            </div>
            <div>
                <Button color="secondary" onClick={addNewList}>
                    <AddIcon />
                </Button>
                New List
            </div>
            <div>
                <Input />
                <Button color="secondary">
                    <SearchIcon />
                </Button>
            </div>
            <div>
                <Button color="secondary">
                    <FilterListIcon />
                </Button>
                Filter
            </div>
        </BackGround>
    )
}
