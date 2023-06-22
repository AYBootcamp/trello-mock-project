import { createCard } from './createCard.mjs'

export const handler = async (event) => {
    const { title, listId, boardId } = event;

    return createCard(title, listId, boardId);
};