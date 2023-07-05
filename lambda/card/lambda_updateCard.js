import { updateCard } from './updateCard.mjs'

export const handler = async (event) => {
    const body = JSON.parse(event.body);
    const { id } = event.queryStringParameters;
    const { title, listId, labels, description } = body
    const updatedAttributes = {
        ...(title !== undefined ? { title } : {}),
        ...(listId !== undefined ? { listId } : {}),
        ...(labels !== undefined ? { labels } : {}),
        ...(description !== undefined ? { description } : {}),
    }
    return updateCard(id, updatedAttributes)
};
