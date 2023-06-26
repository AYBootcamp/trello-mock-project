import { updateCardOrder } from './updateCardOrder.mjs'

export const handler = async (event) => {
    const body = JSON.parse(event.body);
    const { id } = event.queryStringParameters
    const { orderedCardIds } = body
    const updatedAttributes = {
        ...(orderedCardIds !== undefined ? { orderedCardIds } : {}),
    }
    return updateCardOrder(id, updatedAttributes)
};
