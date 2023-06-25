import { updateCard } from './updateCard.mjs'

export const handler = async (event) => {
    const body = JSON.parse(event.body);
    const { id } = event.queryStringParameters;
    const { title, listId, labels } = body
    const updatedAttributes = {
        ...(title !== undefined ? { title } : {}),
        ...(listId !== undefined ? { listId } : {}),
        ...(labels !== undefined ? { labels } : {}),
    }
    return updateCard(id, updatedAttributes)
};
