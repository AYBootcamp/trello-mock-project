import { createCard } from './createCard'
export const handler = async (event) => {
    const { title, listId } = event;

    return createCard(title, listId);
};