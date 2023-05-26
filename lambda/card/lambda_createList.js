import { createList } from './createList'

export const handler = async (event) => {
    const { title } = event;

    return createList(title);
};