import { ALEX_BOARD_ID } from '../../../secrets'
import { MakeRequestProps } from './MakeRequest'

const getListParams = new URLSearchParams({
    boardId: ALEX_BOARD_ID,
})
const deleteListParams = new URLSearchParams({
    id: 'e25fd09f-0287-4923-ae73-6d0237d07cce',
})

const createListData = {
    boardId: ALEX_BOARD_ID,
    title: 'list created from react app',
}

const updateListParams = new URLSearchParams({
    id: 'b0800e1e-9f18-4697-8855-4e5729c0aa79',
})
const updateListData = {
    title: 'updated list',
}

const listRequests: MakeRequestProps[] = [
    {
        title: 'get-lists',
        url: `https://2qgj2kp27f.execute-api.ca-central-1.amazonaws.com/prod/getLists?${getListParams.toString()}`,
        init: {
            method: 'GET',
        },
    },
    {
        title: 'create-list',
        url: `https://2qgj2kp27f.execute-api.ca-central-1.amazonaws.com/prod/createList`,
        init: {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(createListData),
        },
    },
    {
        title: 'delete-list',
        url: `https://2qgj2kp27f.execute-api.ca-central-1.amazonaws.com/prod/deleteList?${deleteListParams.toString()}`,
        init: {
            method: 'DELETE',
        },
    },
    {
        title: 'update-list',
        url: `https://2qgj2kp27f.execute-api.ca-central-1.amazonaws.com/prod/updateList?${updateListParams.toString()}`,
        init: {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateListData),
        },
    },
]
export default listRequests
