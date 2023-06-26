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
        UpdateExpression: "SET orderedListIds = :orderedListIds",
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

const id = "5e0e2ade-bcae-4a51-b8a2-c10450227be2"
// ["3c214d2a-d596-4472-bb02-e1e303ef7e44", "1a58b21d-a893-43ce-95a5-92f3713d1aa0"]
// ["1a58b21d-a893-43ce-95a5-92f3713d1aa0", "3c214d2a-d596-4472-bb02-e1e303ef7e44"]
const newListOrder = `["b0800e1e-9f18-4697-8855-4e5729c0aa79" , "934bcd7e-de11-4ba6-a4fd-6fdf564820d4"]`
const updatedAttributes = {
    orderedListIds: newListOrder
}
// listOrder id, new order
console.log(await updateListOrder(id, updatedAttributes));