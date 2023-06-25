import { styled } from '@mui/material/styles'

import MakeRequest, { MakeRequestProps } from './MakeRequest'

const ALEX_BOARD_ID = '7128fdcf-c164-4494-8ba2-bf8097704eaf'
const MakeRequestContainer = styled('div')`
    padding-left: 20px;
`

const Playground = () => {
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
    ]

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
    ]

    const getCardOrderParams = new URLSearchParams({
        listId: 'b0800e1e-9f18-4697-8855-4e5729c0aa79',
    })
    const getListOrderParams = new URLSearchParams({
        boardId: '7128fdcf-c164-4494-8ba2-bf8097704eaf',
    })
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
    ]

    return (
        <div>
            <h1>Playground</h1>
            <h2>List Requests</h2>
            <MakeRequestContainer>
                {listRequests.map((request) => (
                    <MakeRequest key={request.title} {...request} />
                ))}
            </MakeRequestContainer>
            <h2>Card Requests</h2>
            <MakeRequestContainer>
                {cardRequests.map((request) => (
                    <MakeRequest key={request.title} {...request} />
                ))}
            </MakeRequestContainer>

            <h2>Order Requests</h2>
            <MakeRequestContainer>
                {orderRequests.map((request) => (
                    <MakeRequest key={request.title} {...request} />
                ))}
            </MakeRequestContainer>
        </div>
    )
}

export default Playground
