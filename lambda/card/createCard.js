/* global process */
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from 'uuid'
import { marshall } from "@aws-sdk/util-dynamodb"

// Create a DynamoDB document client
const client = new DynamoDBClient({
    region: process.env.AWS_DEFAULT_REGION
});
const TABLE_NAME = 'trello-card'
const LIST_ID = '485dbda6-c4dc-4930-a90a-940c48317ccd'

export const createCard = async () => {
    // Define the properties of the card
    const card = {
        id: uuidv4(),
        title: 'test-title-2',
        listId: LIST_ID,
    };

    // Create the DynamoDB parameters for the put operation
    const params = {
        TableName: TABLE_NAME, // Replace with the name of your DynamoDB table
        Item: marshall(card)
    };

    try {
        const command = new PutItemCommand(params);
        const response = await client.send(command);
        console.log("Card created successfully:", response);
    } catch (err) {
        console.error("Unable to create card. Error:", err);
    }
}

createCard()