import { MakeRequestProps } from './MakeRequest'

const getCardOrderParams = new URLSearchParams({
    listId: 'b0800e1e-9f18-4697-8855-4e5729c0aa79',
})
const getListOrderParams = new URLSearchParams({
    boardId: '7128fdcf-c164-4494-8ba2-bf8097704eaf',
})
const updateListOrderParams = new URLSearchParams({
    id: '5e0e2ade-bcae-4a51-b8a2-c10450227be2',
})
const updateListOrderData = {
    orderedListIds: [
        '934bcd7e-de11-4ba6-a4fd-6fdf564820d4',
        'b0800e1e-9f18-4697-8855-4e5729c0aa79',
    ],
}

const updateCardOrderParams = new URLSearchParams({
    id: 'eca680de-ea4e-4c60-bb24-2cbf712f8a60',
})
const updateCardOrderData = {
    orderedCardIds: [
        '54c6e0f3-d00b-4d74-ade6-100b42cfaa6e',
        'dcd793b6-45f7-4942-a37f-7144a66972b5',
        '5d45d34c-d63a-4693-b467-b679a8eaa064',
    ],
}

const orderRequests: MakeRequestProps[] = [
    {
        title: 'get-card-order',
        url: `https://2qgj2kp27f.execute-api.ca-central-1.amazonaws.com/prod/getCardOrder?${getCardOrderParams.toString()}`,
        init: {
            method: 'GET',
        },
    },
    {
        title: 'get-list-order',
        url: `https://2qgj2kp27f.execute-api.ca-central-1.amazonaws.com/prod/getListOrder?${getListOrderParams.toString()}`,
        init: {
            method: 'GET',
        },
    },
    {
        title: 'update-list-order',
        url: `https://2qgj2kp27f.execute-api.ca-central-1.amazonaws.com/prod/updateListOrder?${updateListOrderParams.toString()}`,
        init: {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateListOrderData),
        },
    },
    {
        title: 'update-card-order',
        url: `https://2qgj2kp27f.execute-api.ca-central-1.amazonaws.com/prod/updateCardOrder?${updateCardOrderParams.toString()}`,
        init: {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateCardOrderData),
        },
    },
]

export default orderRequests
