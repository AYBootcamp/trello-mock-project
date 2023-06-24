import { useState } from 'react'

const apiKey = 'gVEC2aZKAP7VPs1LmgIRx5DY1hjfYevu1vZxxfIM'

export interface MakeRequestProps {
    title: string
    url: string
    init?: RequestInit
}

const MakeRequest: React.FC<MakeRequestProps> = ({ title, url, init }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [data, setData] = useState({})

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
        return <div>{JSON.stringify(data, null, 2)}</div>
    }

    return (
        <div>
            <h3>{title}</h3>
            <button type="button" onClick={onClickHandler}>
                Fire Request
            </button>
            {renderData()}
        </div>
    )
}

export default MakeRequest
