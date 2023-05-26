import { createCard } from './createCard.mjs'

export const handler = async (event) => {
    const { title, listId } = event;

    return createCard(title, listId);
};