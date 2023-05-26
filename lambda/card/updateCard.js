import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const REGION = 'ca-central-1';
const TABLE_NAME = 'trello-card';
const dynamoDBClient = new DynamoDBClient({ region: REGION });
const docClient = DynamoDBDocumentClient.from(dynamoDBClient);

// Update the item in the table
export const updateCard = async (id, updatedAttributes) => {
    const itemKey = {
        id: id,
    };

    // Create the UpdateExpression and ExpressionAttributeValues based on the provided attributes
    let updateExpression = "SET";
    const expressionAttributeValues = {};
    Object.entries(updatedAttributes).forEach(([key, value], index) => {
        updateExpression += ` #${key} = :value${index},`;
        expressionAttributeValues[`:value${index}`] = typeof value === "string" ? value : JSON.stringify(value);
    });
    updateExpression = updateExpression.slice(0, -1); // Remove the trailing comma


    // Create the UpdateItem command
    const updateItemCommand = new UpdateCommand({
        TableName: TABLE_NAME,
        Key: itemKey,
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: {
            ...(updatedAttributes.title ? { "#title": "title" } : {}),
            ...(updatedAttributes.listId ? { "#listId": "listId" } : {}),
            ...(updatedAttributes.labels ? { "#labels": "labels" } : {}),
        },
        ExpressionAttributeValues: expressionAttributeValues,
    });

    try {
        const response = await docClient.send(updateItemCommand);
        console.log("Item updated successfully:", response);
        return { statusCode: 202, body: JSON.stringify('Card Updated!') };
    } catch (error) {
        console.error("Error updating item:", error);
        return { statusCode: 400, body: JSON.stringify(`Unable to update card. ${error}`) };
    }
};

const id = "1a484289-9f67-4099-8f72-db5907c03957"

const updatedAttributes = {
    title: "Updated Title", // Replace with the updated title
    listId: "Updated List ID", // Replace with the updated list ID
    labels: [{ "id": "test-label-id-123", "name": "test-label", "color": "#000" }], // Replace with the updated label values
};

console.log(await updateCard(id, updatedAttributes));