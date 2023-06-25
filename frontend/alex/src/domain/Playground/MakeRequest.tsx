import { styled } from '@mui/material/styles'
import { useState } from 'react'

const apiKey = 'gVEC2aZKAP7VPs1LmgIRx5DY1hjfYevu1vZxxfIM'

const MakeRequestWrapper = styled('div')`
    border: 2px solid green;
    padding: 10px;
    margin: 10px;
    border-radius: 5px;
`

export interface MakeRequestProps {
    title: string
    url: string
    init?: RequestInit
}

const MakeRequest: React.FC<MakeRequestProps> = ({ title, url, init }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [data, setData] = useState(null)

    const onClickHandler = () => {
        fireRequest()
    }

    const fireRequest = async () => {
        setIsLoading(true)
        try {
            const data = await (
                await fetch(url, {
                    ...init,
                    headers: {
                        'X-API-KEY': apiKey,
                        ...init?.headers,
                    },
                })
            ).json()

            setData(data)
            setIsLoading(false)
        } catch (e) {
            console.log({ e })
        }
    }

    const renderData = () => {
        if (isLoading) {
            return <div>...loading...</div>
        }
        return (
            <div>
                <h4>request result</h4>
                <pre>{JSON.stringify(data ?? 'No data', null, 2)}</pre>
            </div>
        )
    }

    return (
        <MakeRequestWrapper>
            <h3>{title}</h3>
            <button type="button" onClick={onClickHandler}>
                Fire Request
            </button>
            <div>
                <h4>request url:</h4>
                <pre>{JSON.stringify(url, null, 2)}</pre>
                <h4>request body:</h4>
                <pre>{JSON.stringify(init, null, 2)}</pre>
            </div>
            {renderData()}
        </MakeRequestWrapper>
    )
}

export default MakeRequest
