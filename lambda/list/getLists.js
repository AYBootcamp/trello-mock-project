import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

const REGION = 'ca-central-1';
const TABLE_NAME = 'trello-list';

const dynamodb = new DynamoDBClient({
    region: REGION,
});


export const getLists = async (substring, boardId) => {

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
        return { statusCode: 400, message: JSON.stringify(`Must provide boardId`) };
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
        const unmarshalledItems = items.map(item => unmarshall(item));

        return {
            statusCode: 201,
            headers,
            body: JSON.stringify({
                message: JSON.stringify('Lists returned!'),
                data: unmarshalledItems
            })
        };
    } catch (err) {
        return {
            statusCode: 400, headers, body: JSON.stringify({
                message: JSON.stringify(`Error retrieving Lists from DynamoDB table. ${err}`)
            }
            )
        }
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


// substring, boardId
console.log((await getLists(undefined, '7128fdcf-c164-4494-8ba2-bf8097704eaf')));