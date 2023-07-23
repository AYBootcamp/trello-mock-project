import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand, GetCommand, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { deleteCardById } from '../card/deleteCard.js'

const REGION = 'ca-central-1'
const LIST_TABLE_NAME = 'trello-list';
const LIST_ORDER_TABLE_NAME = 'trello-list-order'
const CARD_ORDER_TABLE_NAME = 'trello-card-order'
const GSI_NAME = "boardId-index"
const CARD_ORDER_GSI_NAME = "listId-index"

const client = new DynamoDBClient({
    region: REGION,
});
const docClient = DynamoDBDocumentClient.from(client);

/*
    1. Find the List object using listId
    2. Find the ListOrder object using List's boardId
    3. Update the ListOrder object with listId removed
    4. Delete Cards belong to the List
    5. Delete CardOrder by the list id
    6. Remove the List object

*/
export const deleteListById = async (listId) => {

    const headers = {
        "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,DELETE"
    }

    try {
        const list = await getListById(listId)
        if (!list) {
            return {
                headers,
                statusCode: 400,
                body: JSON.stringify({
                    message: 'Unable to find list with that id'
                })
            }
        }

        const listOrderResp = await findListOrderByBoardId(list.boardId)

        if (!listOrderResp) {
            return {
                headers,
                statusCode: 400,
                body: JSON.stringify({
                    message: JSON.stringify(`Unable to find list order with that id.`)
                })
            };
        }

        const orderedListIds = listOrderResp.orderedListIds
        const newOrderList = orderedListIds.filter(id => id !== listId)

        await updateListOrder(listOrderResp.id, newOrderList)

        const cardOrderResp = await findCardOrderByListId(listId)
        if (!cardOrderResp) {
            return {
                headers,
                statusCode: 400,
                body: JSON.stringify({
                    message: JSON.stringify(`Unable to find card order with that id.`)
                })
            };
        }
        const orderedCardIds = cardOrderResp.orderedCardIds
        await Promise.all(orderedCardIds.map(id => deleteCardById(id, listId)))
        await deleteCardOrder(cardOrderResp.id)
        await deleteList(listId)
        return {
            headers,
            statusCode: 202,
            body: JSON.stringify({
                message: JSON.stringify('List deleted!')
            })
        };
    }
    catch (e) {
        console.log(e)
        return {
            headers,
            statusCode: 400,
            body: JSON.stringify({
                message: JSON.stringify(`Unable to delete List. ${e}`),
                error: e
            })
        };
    }
};


const getListById = async (listId) => {
    const params = {
        TableName: LIST_TABLE_NAME,
        Key: {
            "id": listId,
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
        console.error("Error getting list by Id ", e)
        throw e
    }
}

const findListOrderByBoardId = async (boardId) => {
    const params = {
        TableName: LIST_ORDER_TABLE_NAME,
        IndexName: GSI_NAME,
        KeyConditionExpression: "boardId = :boardId",
        ExpressionAttributeValues: {
            ":boardId": boardId,
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
        console.error("Error querying the trello_list_order:", error);
        throw error;
    }
}

const updateListOrder = async (orderId, newOrderList) => {
    const itemKey = {
        id: orderId,
    };

    const updateItemCommand = new UpdateCommand({
        TableName: LIST_ORDER_TABLE_NAME,
        Key: itemKey,
        UpdateExpression: "SET orderedListIds = :newOrderList",
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
            throw error
        });
}

const deleteCardOrder = async (cardOrderId) => {
    const params = {
        TableName: CARD_ORDER_TABLE_NAME,
        Key: {
            id: cardOrderId,
        },
    };
    const command = new DeleteCommand(params);

    try {
        await docClient.send(command);
        console.log(`CardOrder with ID ${cardOrderId} deleted successfully.`);
        return { statusCode: 202, message: JSON.stringify('Card Order deleted!') };
    } catch (err) {
        console.error(`Error deleting List with ID ${cardOrderId}:`, err);
        throw err
    }
}


const deleteList = async (id) => {
    const params = {
        TableName: LIST_TABLE_NAME,
        Key: {
            id: id,
        },
    };
    const command = new DeleteCommand(params);

    try {
        await docClient.send(command);
        console.log(`List with ID ${id} deleted successfully.`);
        return { statusCode: 202, message: JSON.stringify('List deleted!') };
    } catch (err) {
        console.error(`Error deleting List with ID ${id}:`, err);
        throw err
    }
}

const findCardOrderByListId = async (listId) => {
    const params = {
        TableName: CARD_ORDER_TABLE_NAME,
        IndexName: CARD_ORDER_GSI_NAME,
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

// list id
console.log(await deleteListById('32011409-5526-40f1-8711-913e6e7bba2a'));