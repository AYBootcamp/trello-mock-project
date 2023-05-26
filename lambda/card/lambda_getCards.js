import { getCards } from './getCards'

export const handler = async (event) => {
    const { substring, listId } = event
    return getCards(substring, listId)
};
