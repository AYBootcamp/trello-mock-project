import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const REGION = 'ca-central-1';
const TABLE_NAME = 'trello-list';
const dynamoDBClient = new DynamoDBClient({ region: REGION });
const docClient = DynamoDBDocumentClient.from(dynamoDBClient);

// Update the item in the table
export const updateList = async (id, updatedAttributes) => {
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
        },
        ExpressionAttributeValues: expressionAttributeValues,
    });

    try {
        const response = await docClient.send(updateItemCommand);
        console.log("Item updated successfully:", response);
        return { statusCode: 202, body: JSON.stringify('List Updated!') };
    } catch (error) {
        console.error("Error updating item:", error);
        return { statusCode: 400, body: JSON.stringify(`Unable to update List. ${error}`) };
    }
};

const id = "8c93aa19-1880-4138-892c-6ff7bbf0a630"

const updatedAttributes = {
    title: "Updated Title", // Replace with the updated title
};

console.log(await updateList(id, updatedAttributes));