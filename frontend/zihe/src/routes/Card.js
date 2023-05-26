import Box from '@mui/joy/Box'
import ButtonJ from '@mui/joy/Button'
import Checkbox from '@mui/joy/Checkbox'
import List from '@mui/joy/List'
import ListItem from '@mui/joy/ListItem'
import Sheet from '@mui/joy/Sheet'
import { Button, Input, TextField } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'

import { setCardDetails } from '../redux/listSlice'

export default function Card() {
    const today = dayjs()
    const tomorrow = dayjs().add(1, 'day')
    const dispatch = useDispatch()
    const { cardBox, currentCard } = useSelector((state) => state.list)
    const currentCardDetail = cardBox.filter((item) => item.id === currentCard)
    const currentCardDetails = currentCardDetail[0]
    const [name, setName] = useState(currentCardDetails.name)
    const [descript, setDescript] = useState(currentCardDetails.descript)
    const [dateRange, setDateRange] = useState(currentCardDetails.date)
    const [checkLists, setCheckLists] = useState(currentCardDetails.checkLists)
    const [newItem, setNewItem] = useState('')

    const saveCardChanges = () => {
        const cardArray = {
            id: currentCardDetails.id,
            name: name,
            descript: descript,
            date: dateRange,
            checkLists: checkLists,
        }
        dispatch(setCardDetails([currentCardDetails.id, cardArray]))
    }
    const dateSave = (e) => {
        const uniqueId = uuidv4()
        const date = {
            id: uniqueId,
            startYear: e[0].$y,
            startMonth: e[0].$M + 1,
            startDay: e[0].$D,
            endYear: e[1].$y,
            endMonth: e[1].$M + 1,
            endDay: e[1].$D,
        }
        setDateRange(date)
    }
    const clickCheckBox = (e, checkName) => {
        const checkBoxClick = checkLists.map((item) => {
            if (item.name === checkName) {
                return { ...item, checked: e.target.checked }
            }
            return item
        })
        /* [
            ...checkLists,
            (checkLists[index].checked = e.target.checked),
        ] */
        setCheckLists(checkBoxClick)
    }
    const addAnItem = () => {
        checkLists === undefined
            ? setCheckLists([{ name: newItem, checked: false }])
            : setCheckLists([...checkLists, { name: newItem, checked: false }])
    }
    const clearCheckList = () => {
        const emptyCheckBox = checkLists.map((item) => {
            return { ...item, checked: false }
        })
        setCheckLists(emptyCheckBox)
    }

    useEffect(() => {
        const checkListArray = {
            id: currentCardDetails.id,
            name: currentCardDetails.name,
            descript: currentCardDetails.descript,
            date: currentCardDetails.dateRange,
            checkLists: checkLists,
        }
        dispatch(setCardDetails([currentCardDetails.id, checkListArray]))
    }, [checkLists])
    return (
        <div style={{ padding: '50px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {currentCardDetails.name ? (
                    <h1>{currentCardDetails.name}</h1>
                ) : (
                    <div />
                )}
                <div>
                    <h3>Rename the card:</h3>
                    <Input
                        onChange={(e) => {
                            setName(e.target.value)
                        }}
                    ></Input>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <h2>Description</h2>
                    {currentCardDetails.descript ? (
                        <h3>{currentCardDetails.descript}</h3>
                    ) : (
                        <div />
                    )}
                </div>
                <div>
                    <h3>Modify the description:</h3>
                    <TextField
                        multiline
                        rows={5}
                        onChange={(e) => {
                            setDescript(e.target.value)
                        }}
                    ></TextField>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <h2>Date range</h2>
                    {currentCardDetails.date ? (
                        <h3>
                            {currentCardDetails.date.startMonth}/
                            {currentCardDetails.date.startDay}/
                            {currentCardDetails.date.startYear}~
                            {currentCardDetails.date.endMonth}/
                            {currentCardDetails.date.endDay}/
                            {currentCardDetails.date.endYear}
                        </h3>
                    ) : (
                        <div />
                    )}
                </div>
                <div>
                    <h3>Pick another date range:</h3>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DateRangePicker']}>
                            <DemoItem component="DateRangePicker">
                                <DateRangePicker
                                    defaultValue={[today, tomorrow]}
                                    onChange={(e) => dateSave(e)}
                                />
                            </DemoItem>
                        </DemoContainer>
                    </LocalizationProvider>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <h2>Checklist</h2>
                    <Sheet
                        variant="outlined"
                        sx={{
                            p: 2,
                            borderRadius: 'sm',
                            width: 300,
                        }}
                    >
                        <Box role="group" aria-labelledby="filter-status">
                            <List>
                                {currentCardDetails.checkLists ? (
                                    currentCardDetails.checkLists.map(
                                        (item, index) => {
                                            return (
                                                <ListItem
                                                    key={`${item.name}`}
                                                    variant="plain"
                                                    sx={{ borderRadius: 'sm' }}
                                                >
                                                    <Checkbox
                                                        color="neutral"
                                                        overlay
                                                        checked={item.checked}
                                                        onChange={(e) =>
                                                            clickCheckBox(
                                                                e,
                                                                item.name
                                                            )
                                                        }
                                                    />
                                                    {item.name}
                                                </ListItem>
                                            )
                                        }
                                    )
                                ) : (
                                    <div />
                                )}
                            </List>
                        </Box>
                        <ButtonJ
                            variant="outlined"
                            color="neutral"
                            size="sm"
                            sx={{ px: 1.5, mt: 1 }}
                            onClick={clearCheckList}
                        >
                            Clear All
                        </ButtonJ>
                    </Sheet>
                </div>
                <div>
                    <h3>Add an item:</h3>
                    <input
                        type="text"
                        onChange={(e) => setNewItem(e.target.value)}
                    ></input>
                    <button onClick={addAnItem}>Add</button>
                </div>
            </div>
            <Button onClick={saveCardChanges}>
                <Link to={'/'}>Save</Link>
            </Button>
        </div>
    )
}
