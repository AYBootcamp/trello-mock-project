import { getCards } from './getCards.mjs'

export const handler = async (event) => {
    const { substring, boardId } = event.queryStringParameters
    return getCards(substring, boardId)
};
