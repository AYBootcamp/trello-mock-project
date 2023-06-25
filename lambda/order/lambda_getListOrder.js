import { getListOrder } from './getListOrder.mjs'

export const handler = async (event) => {
    const { boardId } = event.queryStringParameters
    return getListOrder(boardId)
};
