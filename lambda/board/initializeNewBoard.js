import { v4 as uuidv4 } from 'uuid'
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const REGION = 'ca-central-1';
const LIST_ORDER_TABLE_NAME = 'trello-list-order'
const BOARD_TABLE_NAME = 'trello-board'
// Create a DynamoDB document client
const client = new DynamoDBClient({
    region: REGION
});


export const initializeNewBoard = async (owner) => {
    const boardId = uuidv4();
    const createBoardResp = await createNewBoard(boardId, owner)
    console.log(createBoardResp)
    const createListOrderResp = await createNewListOrder(boardId)
    console.log(createListOrderResp)
}


const createNewBoard = async (boardId, owner) => {
    const board = {
        id: { S: boardId },
        owner: { S: owner }
    }
    const params = {
        TableName: BOARD_TABLE_NAME,
        Item: board
    }
    try {
        // Create the PutItem command
        const command = new PutItemCommand(params);
        // Send the command to DynamoDB
        await client.send(command);
        return { statusCode: 201, message: JSON.stringify('Board created!'), data: board };
    } catch (err) {
        return { statusCode: 400, message: JSON.stringify(`Unable to create Board. ${err}`) };
    }
}

const createNewListOrder = async (boardId) => {
    const listOrderId = uuidv4()
    const orderedListIds = []
    const listOrder = {
        id: { S: listOrderId },
        boardId: { S: boardId },
        orderedListIds: { L: orderedListIds }
    }
    const params = {
        TableName: LIST_ORDER_TABLE_NAME,
        Item: listOrder
    }
    try {
        // Create the PutItem command
        const command = new PutItemCommand(params);
        // Send the command to DynamoDB
        await client.send(command);
        return { statusCode: 201, message: JSON.stringify('ListOrder created!'), data: listOrder };
    } catch (err) {
        return { statusCode: 400, message: JSON.stringify(`Unable to create ListOrder. ${err}`) };
    }
}

// Only execute this script when setting up a new board
console.log(await (initializeNewBoard('Test')))