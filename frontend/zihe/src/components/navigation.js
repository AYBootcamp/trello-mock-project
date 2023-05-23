import AddIcon from '@mui/icons-material/Add'
import FilterListIcon from '@mui/icons-material/FilterList'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid'

import { setNewBox } from '../redux/listSlice'

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

export default function Navigation() {
    const dispatch = useDispatch()
    const { listBox } = useSelector((state) => state.list)
    const addNewList = () => {
        const uniqueId = uuidv4()
        const newBox = {
            id: uniqueId,
            sequence: listBox.length + 1,
            card: [],
        }
        dispatch(setNewBox(newBox))
    }

    return (
        <BackGround>
            <div>Trello</div>
            <div>
                <button onClick={addNewList}>
                    <AddIcon />
                </button>
                New List
            </div>
            <div>
                <input />
                <button>Search</button>
            </div>
            <div>
                <button>
                    <FilterListIcon />
                </button>
                Filter
            </div>
        </BackGround>
    )
}
