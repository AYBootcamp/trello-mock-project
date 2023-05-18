import AWS from 'aws-sdk'

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_DEFAULT_REGION
});

const docClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'trello-card'

const params = {
    TableName: TABLE_NAME,
    FilterExpression: 'contains (title, :substring)',
    ExpressionAttributeValues: {
        ':substring': 'test'
    },
    ScanIndexForward: true // Optional sorting option (true for ascending, false for descending)
};

docClient.scan(params, (err, data) => {
    if (err) {
        console.error('Error retrieving items from DynamoDB table:', err);
    } else {
        console.log('Retrieved items:', data.Items);
    }
});