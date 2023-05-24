/* global process */
import AWS from 'aws-sdk'

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_DEFAULT_REGION
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'trello-card'

export const handler = async (event) => {
    const { title, listId } = event

    try {
        // Define the scan parameters
        const params = {
            TableName: TABLE_NAME,
            ScanIndexForward: true // Optional sorting option (true for ascending, false for descending)
        };

        // Check if filtering by title substring is requested
        if (title) {
            params.FilterExpression = 'contains(title, :title)';
            params.ExpressionAttributeValues = { ':title': title };
        }

        // Check if filtering by matching listId is requested
        if (listId) {

            // Update the filter expression and attribute values based on existing filter expressions
            if (params.FilterExpression) {
                params.FilterExpression += ' AND listId = :listId';
                params.ExpressionAttributeValues[':listId'] = listId;
            } else {
                params.FilterExpression = 'listId = :listId';
                params.ExpressionAttributeValues = { ':listId': listId };
            }
        }

        // Perform the scan operation
        let scanResult = await dynamodb.scan(params).promise();

        // Process the scanned items
        let items = scanResult.Items;
        // for (let item of items) {
        //     // Process each item as needed
        //     console.log(item);
        // }

        // Continue scanning if the response indicates there is more data
        while (scanResult.LastEvaluatedKey) {
            params.ExclusiveStartKey = scanResult.LastEvaluatedKey;
            scanResult = await dynamodb.scan(params).promise();
            items = items.concat(scanResult.Items);
            // for (let item of scanResult.Items) {
            //     // Process each item as needed
            //     console.log(item);
            // }
        }

        return {
            statusCode: 200,
            body: JSON.stringify(items),
        };
    } catch (error) {
        console.error('Error scanning DynamoDB table:', error);
        throw error;
    }
};
