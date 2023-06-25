import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

const REGION = 'ca-central-1';
const TABLE_NAME = 'trello-card';

const dynamodb = new DynamoDBClient({
    region: REGION,
});


export const getCards = async (substring, listId, boardId) => {

    const headers = {
        "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,GET"
    }

    // Define the scan parameters
    const params = {
        TableName: TABLE_NAME,
        ScanIndexForward: true // Optional sorting option (true for ascending, false for descending)
    };

    if (!boardId) {
        return {
            headers,
            statusCode: 400,
            body: JSON.stringify({
                message: JSON.stringify(`Must provide boardId`)
            })
        };
    }

    params.FilterExpression = 'boardId = :boardId'
    params.ExpressionAttributeValues = marshall({ ':boardId': boardId })

    // Check if filtering by title substring is requested
    if (substring) {
        params.FilterExpression += ' AND contains(title, :title)';
        params.ExpressionAttributeValues = {
            ...params.ExpressionAttributeValues,
            ...marshall({ ':title': substring })
        };
    }

    // Check if filtering by matching listId is requested
    if (listId) {
        // Update the filter expression and attribute values based on existing filter expressions
        params.FilterExpression += ' AND listId = :listId';
        params.ExpressionAttributeValues = {
            ...params.ExpressionAttributeValues,
            ...marshall({ ':listId': listId })
        };
    }

    try {
        // Perform the scan operation
        const command = new ScanCommand(params);
        const response = await dynamodb.send(command);
        const items = response.Items;

        // Continue scanning if the response indicates there is more data
        if (response.LastEvaluatedKey) {
            params.ExclusiveStartKey = response.LastEvaluatedKey;
            const remainingItems = await getRemainingItems(params);
            return items.concat(remainingItems);
        }

        return {
            headers,
            statusCode: 201,
            body: JSON.stringify({
                message: JSON.stringify('Cards returned!'),
                data: items
            })
        };
    } catch (err) {
        return {
            headers,
            statusCode: 400,
            body: JSON.stringify({
                message: JSON.stringify(`Error retrieving Cards from DynamoDB table.`),
                error: JSON.stringify(err)
            })
        };
    }
}


const getRemainingItems = async (params) => {
    let items = [];

    // eslint-disable-next-line no-constant-condition
    while (true) {
        try {
            const command = new ScanCommand(params);
            const response = await dynamodb.send(command);
            const scannedItems = response.Items;

            if (response.LastEvaluatedKey) {
                params.ExclusiveStartKey = response.LastEvaluatedKey;
                items = items.concat(scannedItems);
            } else {
                return items.concat(scannedItems);
            }
        } catch (err) {
            console.error('Error retrieving remaining items from DynamoDB table:', err);
            throw err;
        }
    }
};

// substring, listId, boardId
// console.log(await getCards(undefined, undefined, '16bf7333-eac2-40e8-9a04-41ba99c042c0'));