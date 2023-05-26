import { getLists } from './getLists.mjs'

export const handler = async (event) => {
    const { title } = event;

    return getLists(title);
};