import { getListOrder } from './getListOrder.js'

export const handler = async (event) => {
    const { boardId } = event
    return getListOrder(boardId)
};
