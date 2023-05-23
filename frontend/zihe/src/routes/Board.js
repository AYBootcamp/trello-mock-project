import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import ListDetails from '../components/listDetails'

const AllLists = styled.div`
    display: flex;
    flex-direction: row-reverse;
    justify-content: flex-end;
`
const ListBox = styled.div`
    border: 1px solid black;
    background-color: lavender;
    flex-basis: 300px;
    flex-grow: 0;
    flex-shrink: 0;
    margin: 10px;
    padding: 5px;
    border-radius: 10px;
    height: 100%;
`
export default function Board() {
    const { listBox } = useSelector((state) => state.list)
    return (
        <div>
            <AllLists>
                {listBox.map((list, index) => (
                    <ListBox key={list.id}>
                        <ListDetails list={list} index={index} />
                    </ListBox>
                ))}
            </AllLists>
        </div>
    )
}
