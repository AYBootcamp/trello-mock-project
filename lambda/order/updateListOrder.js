import { DynamoDBClient, } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const REGION = 'ca-central-1';
const TABLE_NAME = 'trello-list-order';
const dynamoDBClient = new DynamoDBClient({ region: REGION });
const docClient = DynamoDBDocumentClient.from(dynamoDBClient);

// Update the item in the table
export const updateListOrder = async (id, updatedAttributes) => {

    const headers = {
        "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,PUT"
    }

    const params = {
        TableName: TABLE_NAME,
        Key: {
            id: id,
        },
        UpdateExpression: "SET orderedListIds = list_append(orderedListIds, :orderedListIds)",
        ExpressionAttributeValues: {
            ":orderedListIds": updatedAttributes.orderedListIds
        },
    }

    // Create the UpdateItem command
    const updateItemCommand = new UpdateCommand(params);

    try {
        const response = await docClient.send(updateItemCommand);
        console.log("Item updated successfully:", response);
        return {
            headers,
            statusCode: 202,
            body: JSON.stringify({
                message: JSON.stringify('ListOrder Updated!'),
                data: updatedAttributes.orderedListIds
            })
        };
    } catch (error) {
        console.error("Error updating item:", error);
        return {
            headers,
            statusCode: 400,
            body: JSON.stringify({
                message: JSON.stringify(`Unable to update ListOrder.`),
                error
            })
        };
    }
};

const id = "2818a96f-56c3-43cc-8508-18dfaf9de4a1"
// ["3c214d2a-d596-4472-bb02-e1e303ef7e44", "1a58b21d-a893-43ce-95a5-92f3713d1aa0"]
// ["1a58b21d-a893-43ce-95a5-92f3713d1aa0", "3c214d2a-d596-4472-bb02-e1e303ef7e44"]
// [ { "S" : "384b5e98-e925-4e4c-b3bf-49bb5accb470" }, { "S" : "253d5974-505b-4e6f-b7e6-66f1ad577709" } ]
const newListOrder = ["253d5974-505b-4e6f-b7e6-66f1ad577709", "384b5e98-e925-4e4c-b3bf-49bb5accb470"]
const updatedAttributes = {
    orderedListIds: newListOrder
}
// listOrder id, new order
console.log(await updateListOrder(id, updatedAttributes));