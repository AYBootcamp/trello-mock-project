import { updateCard } from './updateCard.mjs'

export const handler = async (event) => {
    const { id, updatedAttributes } = event
    return updateCard(id, updatedAttributes)
};
