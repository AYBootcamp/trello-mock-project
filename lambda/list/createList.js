import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from 'uuid'

const REGION = 'ca-central-1';
const LIST_TABLE_NAME = 'trello-list'
const CARD_ORDER_TABLE_NAME = 'trello-card-order'

// Create a DynamoDB document client
const client = new DynamoDBClient({
    region: REGION
});

export const createList = async (title) => {
    // Generate a unique ID for the list
    const listId = uuidv4();

    let res = []
    res.push(await createNewList(listId, title))
    res.push(await createNewCardOrder(listId))
    return res
}


const createNewList = async (listId, title) => {
    // Create the DynamoDB item
    const list = {
        id: { S: listId },
        title: { S: title },
    };

    // Create the DynamoDB parameters for the PutItem operation
    const params = {
        TableName: LIST_TABLE_NAME,
        Item: list
    };

    try {
        // Create the PutItem command
        const command = new PutItemCommand(params);

        // Send the command to DynamoDB
        await client.send(command);

        return { statusCode: 201, message: JSON.stringify('List created!'), data: list };
    } catch (err) {
        return { statusCode: 400, message: JSON.stringify(`Unable to create list. ${err}`) };
    }
}

const createNewCardOrder = async (listId) => {
    const cardOrderId = uuidv4()
    const orderedCardIds = []
    const cardOrder = {
        id: { S: cardOrderId },
        listId: { S: listId },
        orderedCardIds: { L: orderedCardIds }
    }
    const params = {
        TableName: CARD_ORDER_TABLE_NAME,
        Item: cardOrder
    }
    try {
        // Create the PutItem command
        const command = new PutItemCommand(params);
        // Send the command to DynamoDB
        await client.send(command);
        return { statusCode: 201, message: JSON.stringify('CardOrder created!'), data: cardOrder };
    } catch (err) {
        return { statusCode: 400, message: JSON.stringify(`Unable to create CardOrder. ${err}`) };
    }
}

console.log(await createList('test-title'))