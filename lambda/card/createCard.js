import { DynamoDBClient, PutItemCommand, QueryCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from 'uuid'
import { unmarshall } from "@aws-sdk/util-dynamodb";

const REGION = 'ca-central-1';
const CARD_TABLE_NAME = 'trello-card'
const CARD_ORDER_TABLE_NAME = 'trello-card-order'
const GSI_NAME = "listId-index"

// Create a DynamoDB document client
const client = new DynamoDBClient({
    region: REGION
});


/*
    1. create a new card object
    2. use listId to find the card order object
    3. add the card id to the end of card order's orderedCardIds array
*/
export const createCard = async (title, listId, boardId) => {
    const headers = {
        "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST"
    }
    // Generate a unique ID for the card
    const cardId = uuidv4();

    try {
        const createCardResp = await createNewCardObject(cardId, title, boardId)
        const cardOrder = await findCardOrderByListId(listId)
        await addCardIdToCardOrderList(cardOrder.id.S, cardId)
        return {
            headers,
            statusCode: 201,
            body: JSON.stringify({
                message: JSON.stringify('Card created!'),
                data: unmarshall(createCardResp.data)
            })
        };
    }
    catch (err) {
        return {
            headers,
            statusCode: 400,
            body: JSON.stringify({
                message: JSON.stringify('Unable to create card.')
            })
        };
    }
}

const createNewCardObject = async (cardId, title, boardId) => {
    // Create the DynamoDB item
    const card = {
        id: { S: cardId },
        title: { S: title },
        boardId: { S: boardId }
    };
    // Create the DynamoDB parameters for the PutItem operation
    const params = {
        TableName: CARD_TABLE_NAME,
        Item: card
    };

    try {
        // Create the PutItem command
        const command = new PutItemCommand(params);

        // Send the command to DynamoDB
        await client.send(command);
        return { statusCode: 201, message: JSON.stringify('Card created!'), data: card };
    } catch (err) {
        console.error('Error creating card')
        throw err
    }
}

const findCardOrderByListId = async (listId) => {
    const params = {
        TableName: CARD_ORDER_TABLE_NAME,
        IndexName: GSI_NAME,
        KeyConditionExpression: "listId = :listId",
        ExpressionAttributeValues: {
            ":listId": { S: listId },
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
        console.error("Error querying the trello_card_order:", error);
        throw error;
    }
}

const addCardIdToCardOrderList = async (cardOrderId, cardId) => {
    const params = {
        TableName: CARD_ORDER_TABLE_NAME,
        Key: {
            id: { S: cardOrderId },
        },
        UpdateExpression: "SET orderedCardIds = list_append(orderedCardIds, :cardId)",
        ExpressionAttributeValues: {
            ":cardId": { L: [{ S: cardId }] },
        },
    };
    try {
        // Execute the UpdateItem command
        const command = new UpdateItemCommand(params);
        await client.send(command);
        console.log("Card ID added to the orderedCardIds list successfully.");
    } catch (error) {
        console.error("Error adding the card ID to the orderedCardIds list:", error);
        throw error;
    }
}

// title, listId, boardId
// console.log(await createCard("alex-card", "b0800e1e-9f18-4697-8855-4e5729c0aa79", "7128fdcf-c164-4494-8ba2-bf8097704eaf"))