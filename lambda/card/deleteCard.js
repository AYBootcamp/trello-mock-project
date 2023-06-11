import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand, QueryCommand, GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const REGION = 'ca-central-1'
const CARD_TABLE_NAME = 'trello-card'
const CARD_ORDER_TABLE_NAME = 'trello-card-order'
const GSI_NAME = "listId-index"

const client = new DynamoDBClient({
    region: REGION,
});
const docClient = DynamoDBDocumentClient.from(client);

/*
    1. Find the Card object using cardId
    2. Find the CardOrderResp object using Card's listId
    3. Update the CardOrder object with cardId removed
    4. Remove the Card object
*/
export const deleteCardById = async (cardId) => {
    try {
        const card = await getCardById(cardId)
        if (!card) {
            return { statusCode: 400, message: JSON.stringify(`Unable to find card with that id.`) };
        }
        const cardOrderResp = await findCardOrderByListId(card.listId)

        if (!cardOrderResp) {
            return { statusCode: 400, message: JSON.stringify(`Unable to find card order with that id.`) };
        }

        const orderedCardIds = cardOrderResp.orderedCardIds
        const newOrderList = orderedCardIds.filter(id => id !== cardId)

        await updateCardOrder(cardOrderResp.id, newOrderList)
        await deleteCard(cardId)
    }
    catch (e) {
        console.log(e)
    }
};


const getCardById = async (cardId) => {
    const params = {
        TableName: CARD_TABLE_NAME,
        Key: {
            "id": cardId,
        },
    };

    const command = new GetCommand(params);

    try {
        const resp = await docClient.send(command)
        if (resp.Item) {
            return resp.Item
        } else {
            return null
        }

    }
    catch (e) {
        return e
    }
}

const deleteCard = async (cardId) => {
    const params = {
        TableName: CARD_TABLE_NAME,
        Key: {
            id: cardId,
        },
    };
    const command = new DeleteCommand(params);

    try {
        await docClient.send(command);
        console.log(`Card with ID ${cardId} deleted successfully.`);
        return { statusCode: 202, message: JSON.stringify('Card deleted!') };
    } catch (err) {
        console.error(`Error deleting card with ID ${cardId}:`, err);
        return { statusCode: 400, message: JSON.stringify(`Unable to delete card. ${err}`) };
    }
}

const findCardOrderByListId = async (listId) => {
    const params = {
        TableName: CARD_ORDER_TABLE_NAME,
        IndexName: GSI_NAME,
        KeyConditionExpression: "listId = :listId",
        ExpressionAttributeValues: {
            ":listId": listId,
        },
    };

    try {
        // Execute the GetItem command
        const command = new QueryCommand(params);
        const response = await docClient.send(command);

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

const updateCardOrder = async (orderId, newOrderList) => {
    const itemKey = {
        id: orderId,
    };

    const updateItemCommand = new UpdateCommand({
        TableName: CARD_ORDER_TABLE_NAME,
        Key: itemKey,
        UpdateExpression: "SET orderedCardIds = :newOrderList",
        ExpressionAttributeValues: {
            ":newOrderList": newOrderList
        },
    });
    client
        .send(updateItemCommand)
        .then(() => {
            console.log("Update successful");
        })
        .catch((error) => {
            console.error("Error updating item:", error);
        });
}

// card id
console.log(await deleteCardById('89340522-bf89-4e93-a26f-57bd07810956'));