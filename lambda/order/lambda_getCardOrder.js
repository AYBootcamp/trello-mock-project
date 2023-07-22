import { getCardOrder } from './getCardOrder.mjs'

export const handler = async (event) => {
    const { boardId, listId } = event.queryStringParameters
    return getCardOrder(boardId, listId)
};
