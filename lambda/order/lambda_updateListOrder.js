import { updateListOrder } from './updateListOrder.mjs'

export const handler = async (event) => {
    const body = JSON.parse(event.body);
    const { id } = event.queryStringParameters
    const { orderedListIds } = body
    const updatedAttributes = {
        ...(orderedListIds !== undefined ? { orderedListIds } : {}),
    }
    return updateListOrder(id, updatedAttributes)
};
