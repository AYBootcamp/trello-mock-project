import { deleteListById } from './deleteList.mjs'

export const handler = async (event) => {
    const { id } = event.queryStringParameters;

    return deleteListById(id);
};