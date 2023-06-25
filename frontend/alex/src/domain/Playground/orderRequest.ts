import { MakeRequestProps } from './MakeRequest'

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

export default orderRequests
