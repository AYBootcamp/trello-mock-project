import { styled } from '@mui/material/styles'

import MakeRequest, { MakeRequestProps } from './MakeRequest'

const MakeRequestContainer = styled('div')`
    padding-left: 20px;
`

const Playground = () => {
    const getListParams = new URLSearchParams({
        boardId: '16bf7333-eac2-40e8-9a04-41ba99c042c0',
    })
    const requests: MakeRequestProps[] = [
        {
            title: 'get-list',
            url: `https://2qgj2kp27f.execute-api.ca-central-1.amazonaws.com/prod/getLists?${getListParams.toString()}`,
            init: {
                method: 'GET',
            },
        },
    ]

    return (
        <div>
            <h1>Playground</h1>
            <h2>Make Requests</h2>
            <MakeRequestContainer>
                {requests.map((request) => (
                    <MakeRequest key={request.title} {...request} />
                ))}
            </MakeRequestContainer>
        </div>
    )
}

export default Playground
