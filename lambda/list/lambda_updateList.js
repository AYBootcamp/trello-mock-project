import { updateList } from './updateList.mjs'

export const handler = async (event) => {
    const { id, updatedAttributes } = event
    return updateList(id, updatedAttributes)
};
