import { deleteListById } from './deleteList.mjs'

export const handler = async (event) => {
    const { id } = event;

    return deleteListById(id);
};