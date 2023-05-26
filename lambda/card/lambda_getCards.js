import { getCards } from './getCards.mjs'

export const handler = async (event) => {
    const { substring, listId } = event
    return getCards(substring, listId)
};
