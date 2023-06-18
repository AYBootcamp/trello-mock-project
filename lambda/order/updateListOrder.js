import { DynamoDBClient, } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const REGION = 'ca-central-1';
const TABLE_NAME = 'trello-list-order';
const dynamoDBClient = new DynamoDBClient({ region: REGION });
const docClient = DynamoDBDocumentClient.from(dynamoDBClient);

// Update the item in the table
export const updateListOrder = async (id, newListOrder) => {

    const params = {
        TableName: TABLE_NAME,
        Key: {
            id: id,
        },
        UpdateExpression: "SET orderedListIds = :newListOrder",
        ExpressionAttributeValues: {
            ":newListOrder": newListOrder
        },
    }

    // Create the UpdateItem command
    const updateItemCommand = new UpdateCommand(params);

    try {
        const response = await docClient.send(updateItemCommand);
        console.log("Item updated successfully:", response);
        return { statusCode: 202, message: JSON.stringify('ListOrder Updated!'), data: newListOrder };
    } catch (error) {
        console.error("Error updating item:", error);
        return { statusCode: 400, message: JSON.stringify(`Unable to update ListOrder. ${error}`) };
    }
};

const id = "60ba4406-f460-4634-a3c6-fb78629edd81"
// ["3c214d2a-d596-4472-bb02-e1e303ef7e44", "1a58b21d-a893-43ce-95a5-92f3713d1aa0"]
// ["1a58b21d-a893-43ce-95a5-92f3713d1aa0", "3c214d2a-d596-4472-bb02-e1e303ef7e44"]
const newListOrder = `["1a58b21d-a893-43ce-95a5-92f3713d1aa0", "3c214d2a-d596-4472-bb02-e1e303ef7e44"]`

// listOrder id, new order
console.log(await updateListOrder(id, newListOrder));