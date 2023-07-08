import { styled } from '@mui/material/styles'

import cardRequests from './cardRequest'
import listRequests from './listRequest'
import MakeRequest from './MakeRequest'
import orderRequests from './orderRequest'

const MakeRequestContainer = styled('div')`
    padding-left: 20px;
`

const RequestPlayground = () => {
    return (
        <div>
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

export default RequestPlayground
