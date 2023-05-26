import { deleteCardById } from './deleteCard.mjs'

export const handler = async (event) => {
    const { id } = event;

    return deleteCardById(id);
};