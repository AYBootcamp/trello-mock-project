import { styled } from '@mui/material/styles'

const CenterMessage = styled('h3')`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-family: 'Roboto';
`

const App = () => {
    return (
        <CenterMessage>
            <h1>Trello Mock App</h1>
            <h3>
                Replace your boardId and API key in src/secrets.ts if you have
                not done so
            </h3>
            <h3>Happy Hacking</h3>
        </CenterMessage>
    )
}

export default App
