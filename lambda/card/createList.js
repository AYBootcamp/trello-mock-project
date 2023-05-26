import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from 'uuid'

const REGION = 'ca-central-1';
const TABLE_NAME = 'trello-list'

// Create a DynamoDB document client
const client = new DynamoDBClient({
    region: REGION
});

const createList = async (title) => {
    // Generate a unique ID for the list
    const listId = uuidv4();
    // Create the DynamoDB item
    const list = {
        id: { S: listId },
        title: { S: title },
    };

    // Create the DynamoDB parameters for the PutItem operation
    const params = {
        TableName: TABLE_NAME,
        Item: list
    };

    try {
        // Create the PutItem command
        const command = new PutItemCommand(params);

        // Send the command to DynamoDB
        await client.send(command);

        return { statusCode: 201, body: JSON.stringify('List created!') };
    } catch (err) {
        return { statusCode: 400, body: JSON.stringify(`Unable to create list. ${err}`) };
    }
}

console.log(await createList('test-title'))