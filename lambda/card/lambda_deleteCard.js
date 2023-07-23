import { deleteCardById } from './deleteCard.mjs'

export const handler = async (event) => {
    const { id, listId } = event.queryStringParameters;

    return deleteCardById(id, listId);
};