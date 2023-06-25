import { getLists } from './getLists.mjs'

export const handler = async (event) => {
    const { title, boardId } = event.queryStringParameters;

    return getLists(title, boardId);
};