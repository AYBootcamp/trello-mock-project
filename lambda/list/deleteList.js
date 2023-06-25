import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand, GetCommand, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const REGION = 'ca-central-1'
const LIST_TABLE_NAME = 'trello-list';
const LIST_ORDER_TABLE_NAME = 'trello-list-order'
const GSI_NAME = "boardId-index"

const client = new DynamoDBClient({
    region: REGION,
});
const docClient = DynamoDBDocumentClient.from(client);



/*
    1. Find the List object using listId
    2. Find the ListOrder object using List's boardId
    3. Update the ListOrder object with listId removed
    4. Remove the List object
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
            return { statusCode: 400, message: JSON.stringify(`Unable to find card order with that id.`) };
        }

        const orderedListIds = listOrderResp.orderedListIds
        const newOrderList = orderedListIds.filter(id => id !== listId)

        await updateListOrder(listOrderResp.id, newOrderList)
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

// list id
// console.log(await deleteListById('4cedf078-250d-4c2f-b1f5-dc395678cc6a'));