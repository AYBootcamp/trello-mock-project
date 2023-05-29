import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from 'uuid'

const REGION = 'ca-central-1';
const TABLE_NAME = 'trello-card'

// Create a DynamoDB document client
const client = new DynamoDBClient({
    region: REGION
});


export const createCard = async (title, listId) => {
    // Generate a unique ID for the card
    const cardId = uuidv4();
    // Create the DynamoDB item
    const card = {
        id: { S: cardId },
        title: { S: title },
        listId: { S: listId }
    };

    // Create the DynamoDB parameters for the PutItem operation
    const params = {
        TableName: TABLE_NAME,
        Item: card
    };

    try {
        // Create the PutItem command
        const command = new PutItemCommand(params);

        // Send the command to DynamoDB
        await client.send(command);
        return { statusCode: 201, message: JSON.stringify('Card created!'), data: card };
    } catch (err) {
        return { statusCode: 400, message: JSON.stringify('Unable to create card.') };
    }
}

// console.log(await createCard("test-title", "test-list-id"))