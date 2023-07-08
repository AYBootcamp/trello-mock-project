import { DynamoDBClient, PutItemCommand, QueryCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from 'uuid'
import { unmarshall } from "@aws-sdk/util-dynamodb";

const REGION = 'ca-central-1';
const LIST_TABLE_NAME = 'trello-list'
const CARD_ORDER_TABLE_NAME = 'trello-card-order'
const LIST_ORDER_TABLE_NAME = 'trello-list-order'
const GSI_NAME = "boardId-index"

// Create a DynamoDB document client
const client = new DynamoDBClient({
    region: REGION
});

/*
    1. create a new list object
    2. create a new card order object
    2. use boardId to find the list order object
    3. add the list id to the end of list order's orderedListIds array
*/
export const createList = async (boardId, title) => {
    const headers = {
        "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST"
    }

    // Generate a unique ID for the list
    const listId = uuidv4();

    try {
        const createListResp = await createNewList(listId, title, boardId)
        await createNewCardOrder(listId)
        const listOrder = await findListOrderByBoardId(boardId)
        await addListIdToListOrderList(listOrder.id.S, listId)
        return {
            statusCode: 201,
            headers,
            body: JSON.stringify({
                message: JSON.stringify('List created!'),
                data: unmarshall(createListResp.data)
            })
        }
    }
    catch (err) {
        return {
            statusCode: 400, headers,
            body: JSON.stringify(
                { message: JSON.stringify('Unable to create list. '), error: err }
            )
        };
    }
}

const findListOrderByBoardId = async (boardId) => {
    const params = {
        TableName: LIST_ORDER_TABLE_NAME,
        IndexName: GSI_NAME,
        KeyConditionExpression: "boardId = :boardId",
        ExpressionAttributeValues: {
            ":boardId": { S: boardId },
        },
    };

    try {
        // Execute the GetItem command
        const command = new QueryCommand(params);
        const response = await client.send(command);

        // Handle the response and return the item
        if (response.Items) {
            return response.Items[0];
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error querying the trello_list_order:", error);
        throw error;
    }
}

const addListIdToListOrderList = async (listOrderId, listId) => {
    const params = {
        TableName: LIST_ORDER_TABLE_NAME,
        Key: {
            id: { S: listOrderId },
        },
        UpdateExpression: "SET orderedListIds = list_append(orderedListIds, :listId)",
        ExpressionAttributeValues: {
            ":listId": { L: [{ S: listId }] },
        },
    };
    try {
        // Execute the UpdateItem command
        const command = new UpdateItemCommand(params);
        await client.send(command);
        console.log("List ID added to the orderedListIds list successfully.");
    } catch (error) {
        console.error("Error adding the list ID to the orderedListIds list:", error);
        throw error;
    }
}


const createNewList = async (listId, title, boardId) => {
    // Create the DynamoDB item
    const list = {
        id: { S: listId },
        title: { S: title },
        boardId: { S: boardId }
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
        console.error("Error creating new list", err)
        throw err
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
        console.error("Error creating new card order", err)
        throw err
    }
}

// boardId, title
console.log(await createList('b5e54729-6dee-4947-8f1d-e8e0d04ae02f', 'test-list 2'))