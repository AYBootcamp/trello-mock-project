import { createList } from './createList.mjs'

export const handler = async (event) => {
    const { title } = event;

    return createList(title);
};