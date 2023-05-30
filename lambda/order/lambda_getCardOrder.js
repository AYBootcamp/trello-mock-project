import { getCardOrder } from './getCardOrder.js'

export const handler = async (event) => {
    const { boardId } = event
    return getCardOrder(boardId)
};
