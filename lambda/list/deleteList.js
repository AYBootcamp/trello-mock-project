import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";

const REGION = 'ca-central-1'
const TABLE_NAME = 'trello-list';

const client = new DynamoDBClient({
    region: REGION,
});
const docClient = DynamoDBDocumentClient.from(client);

export const deleteListById = async (id) => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            id: id,
        },
    };
    const command = new DeleteCommand(params);

    try {
        await docClient.send(command);
        console.log(`List with ID ${id} deleted successfully.`);
        return { statusCode: 202, message: JSON.stringify('List deleted!') };
    } catch (err) {
        console.error(`Error deleting List with ID ${id}:`, err);
        return { statusCode: 400, message: JSON.stringify(`Unable to delete List. ${err}`) };
    }
};

console.log(await deleteListById('73324e71-f5d2-4d5b-9380-25dc7f2e3415'));