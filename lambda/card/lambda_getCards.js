import { getCards } from './getCards.mjs'

export const handler = async (event) => {
    const { substring, listId, boardId } = event.queryStringParameters
    return getCards(substring, listId, boardId)
};
