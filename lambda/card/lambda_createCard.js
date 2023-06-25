import { createCard } from './createCard.mjs'

export const handler = async (event) => {
    const body = JSON.parse(event.body);
    const { title, listId, boardId } = body;

    return createCard(title, listId, boardId);
};