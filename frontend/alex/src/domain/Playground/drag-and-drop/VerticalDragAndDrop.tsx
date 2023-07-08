import { useState } from 'react'
import {
    DragDropContext,
    Draggable,
    Droppable,
    DropResult,
} from 'react-beautiful-dnd'
import styled from 'styled-components'

const Item = styled('li')`
    border: 1px solid red;
    border-radius: 5px;
    padding: 10px;
    margin: 20px 10px;
`

const List = styled('ul')`
    border: 1px solid red;
    padding: 0 20px;
    list-style: none;
`

const VerticalDragAndDrop = () => {
    const [names, setNames] = useState(['alex', 'sara', 'billy', 'john'])

    const handleDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result

        if (!destination) {
            return
        }
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return
        }

        const newNames = Array.from(names)
        newNames.splice(source.index, 1)
        newNames.splice(destination.index, 0, draggableId)

        setNames(newNames)
    }

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div>
                <Droppable droppableId="name-list">
                    {(provided) => (
                        <List
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            {names.map((name, index) => (
                                <Draggable
                                    key={name}
                                    draggableId={name}
                                    index={index}
                                >
                                    {(dragProvided) => (
                                        <Item
                                            {...dragProvided.draggableProps}
                                            {...dragProvided.dragHandleProps}
                                            ref={dragProvided.innerRef}
                                        >
                                            {name}
                                        </Item>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </List>
                    )}
                </Droppable>
            </div>
        </DragDropContext>
    )
}

export default VerticalDragAndDrop
