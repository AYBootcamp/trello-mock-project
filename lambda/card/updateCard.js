import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const REGION = 'ca-central-1';
const TABLE_NAME = 'trello-card';
const dynamoDBClient = new DynamoDBClient({ region: REGION });
const docClient = DynamoDBDocumentClient.from(dynamoDBClient);

// Update the item in the table
export const updateCard = async (id, updatedAttributes) => {

    const headers = {
        "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,PUT"
    }

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
        return {
            headers,
            statusCode: 202,
            body: JSON.stringify({
                message: JSON.stringify('Card Updated!')
            })
        };
    } catch (error) {
        console.error("Error updating item:", error);
        return {
            headers,
            statusCode: 400,
            body: JSON.stringify({
                message: JSON.stringify(`Unable to update card. ${error}`)
            })
        };
    }
};

// const id = "5d45d34c-d63a-4693-b467-b679a8eaa064"

// const updatedAttributes = {
//     title: "Updated Title", // Replace with the updated title
// };

// console.log(await updateCard(id, updatedAttributes));