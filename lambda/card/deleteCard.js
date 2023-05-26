import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";

const REGION = 'ca-central-1'
const TABLE_NAME = 'trello-card';

const client = new DynamoDBClient({
    region: REGION,
});
const docClient = DynamoDBDocumentClient.from(client);

export const deleteCardById = async (cardId) => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            id: cardId,
        },
    };
    const command = new DeleteCommand(params);

    try {
        await docClient.send(command);
        console.log(`Card with ID ${cardId} deleted successfully.`);
        return { statusCode: 202, body: JSON.stringify('Card deleted!') };
    } catch (err) {
        console.error(`Error deleting card with ID ${cardId}:`, err);
        return { statusCode: 400, body: JSON.stringify(`Unable to delete card. ${err}`) };
    }
};

console.log(await deleteCardById('6984d7cd-df49-4816-9044-661ff3d0f820'));