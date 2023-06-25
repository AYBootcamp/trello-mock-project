import { updateList } from './updateList.mjs'

export const handler = async (event) => {
    const body = JSON.parse(event.body);
    const { id } = event.queryStringParameters;
    const { title } = body
    const updatedAttributes = {
        ...(title !== undefined ? { title } : {}),
    }
    return updateList(id, updatedAttributes)
};
