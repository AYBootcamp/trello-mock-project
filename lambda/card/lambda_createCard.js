import { DynamoDBClient, ScanCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from 'uuid'
import { marshall } from "@aws-sdk/util-dynamodb"

// Create a DynamoDB document client
const client = new DynamoDBClient({
    region: 'ca-central-1'
});

const TABLE_NAME = 'trello-card'

// Function to find the highest rank
async function findHighestRank() {
    // Define the parameters for the scan command
    const params = {
        TableName: TABLE_NAME, // Replace with the name of your DynamoDB table
        ProjectionExpression: "cardRank", // Only retrieve the 'rank' attribute
        ScanIndexForward: false, // Retrieve items in descending order of rank
        Limit: 1, // Only retrieve the highest ranked item
    };
    try {
        const command = new ScanCommand(params);
        const response = await client.send(command);

        if (response.Items.length === 0) {
            console.log("No items found in the table.");
            return 0;
        }

        const highestRank = response.Items[0].cardRank.N;
        return parseInt(highestRank)
    } catch (err) {
        console.error("Unable to scan the table. Error:", err);
        return err
    }
}
const createCard = async (title, listId) => {
    // Define the properties of the card
    const rank = await findHighestRank() + 1
    const card = {
        id: uuidv4(),
        title: title,
        listId: listId,
        cardRank: rank
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
        return response
    } catch (err) {
        console.error("Unable to create card. Error:", err);
        return err
    }
}

export const handler = async (event) => {
    const { title, listId } = event
    return createCard(title, listId)
};
