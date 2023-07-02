import { ALEX_BOARD_ID } from '../../secrets'
import { MakeRequestProps } from './MakeRequest'

const getCardParams = new URLSearchParams({
    boardId: ALEX_BOARD_ID,
})

const deleteCardParams = new URLSearchParams({
    id: 'e68b5064-4933-4e20-bed8-de853905ae91',
})

const createCardData = {
    title: 'card-created-from-react-app',
    listId: 'b0800e1e-9f18-4697-8855-4e5729c0aa79',
    boardId: '7128fdcf-c164-4494-8ba2-bf8097704eaf',
}

const updateCardParams = new URLSearchParams({
    id: '5d45d34c-d63a-4693-b467-b679a8eaa064',
})
const updateCardData = {
    title: 'updated card',
}

const cardRequests: MakeRequestProps[] = [
    {
        title: 'get-cards',
        url: `https://2qgj2kp27f.execute-api.ca-central-1.amazonaws.com/prod/getCards?${getCardParams.toString()}`,
        init: {
            method: 'GET',
        },
    },
    {
        title: 'create-card',
        url: `https://2qgj2kp27f.execute-api.ca-central-1.amazonaws.com/prod/createCard`,
        init: {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(createCardData),
        },
    },
    {
        title: 'delete-card',
        url: `https://2qgj2kp27f.execute-api.ca-central-1.amazonaws.com/prod/deleteCard?${deleteCardParams.toString()}`,
        init: {
            method: 'DELETE',
        },
    },
    {
        title: 'update-card',
        url: `https://2qgj2kp27f.execute-api.ca-central-1.amazonaws.com/prod/updateCard?${updateCardParams.toString()}`,
        init: {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateCardData),
        },
    },
]

export default cardRequests
