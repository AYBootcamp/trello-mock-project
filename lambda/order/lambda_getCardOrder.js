import { getCardOrder } from './getCardOrder.js'

export const handler = async (event) => {
    const { listId } = event
    return getCardOrder(listId)
};
