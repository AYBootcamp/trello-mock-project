import { createList } from './createList.mjs'

export const handler = async (event) => {
    const body = JSON.parse(event.body);
    const { boardId, title } = body;

    return createList(boardId, title);
};