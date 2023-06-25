import { getCardOrder } from './getCardOrder.mjs'

export const handler = async (event) => {
    const { listId } = event.queryStringParameters
    return getCardOrder(listId)
};
