import AWS from 'aws-sdk'

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_DEFAULT_REGION
});

const docClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'trello-card'

const defaultParams = {
    TableName: TABLE_NAME,
    ScanIndexForward: true // Optional sorting option (true for ascending, false for descending)
}

const paramsByFunction = {
    filterByTitleSubstring: {
        ...defaultParams,
        FilterExpression: 'contains (title, :substring)',
        ExpressionAttributeValues: {
            ':substring': 'test'
        },
    },
    filterByListId: {
        ...defaultParams,
        FilterExpression: 'listId = :listIdValue',
        ExpressionAttributeValues: {
            ':listIdValue': '485dbda6-c4dc-4930-a90a-940c48317ccd'
        },
    }
}

const params = paramsByFunction.filterByListId

docClient.scan(params, (err, data) => {
    if (err) {
        console.error('Error retrieving items from DynamoDB table:', err);
    } else {
        console.log('Retrieved items:', data.Items);
    }
});