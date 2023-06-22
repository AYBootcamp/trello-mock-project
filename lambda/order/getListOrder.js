import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

const REGION = 'ca-central-1';
const TABLE_NAME = 'trello-list-order';

const dynamodb = new DynamoDBClient({
    region: REGION,
});


export const getListOrder = async (boardId) => {
    // Define the scan parameters
    const params = {
        TableName: TABLE_NAME,
        ScanIndexForward: true // Optional sorting option (true for ascending, false for descending)
    };

    params.FilterExpression = 'boardId = :boardId';
    params.ExpressionAttributeValues = {
        ...marshall({ ':boardId': boardId })
    };


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

        return { statusCode: 201, message: JSON.stringify('ListOrder returned!'), data: items };
    } catch (err) {
        return { statusCode: 400, message: JSON.stringify(`Error retrieving ListOrder from DynamoDB table. ${err}`) };
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

console.log(await getListOrder('3b3f2ba8-4b33-418b-a47a-9963e4678179'));