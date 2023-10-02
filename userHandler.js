// db
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    DeleteCommand,
    UpdateCommand,
    QueryCommand,
} = require("@aws-sdk/lib-dynamodb");
const userModel = require("./userModel");
const { USERS_TABLE, LOCAL_DB_PORT, AWS_REGION } = process.env;

const dynamoDbClientParams = {};
if (process.env.IS_OFFLINE) {
    dynamoDbClientParams.region = AWS_REGION;
    dynamoDbClientParams.endpoint = `http://localhost:${LOCAL_DB_PORT}`;
}
const client = new DynamoDBClient(dynamoDbClientParams);
const dynamoDbClient = DynamoDBDocumentClient.from(client);

async function getUser(userId) {
    const params = {
        TableName: USERS_TABLE,
        Key: {
            userId,
        },
    };

    const { Item } = await dynamoDbClient.send(new GetCommand(params));
    return Item;
}

async function createUser(userData) {
    const { user, error } = userModel.validateUserData(userData);
    if (error) {
        return {
            user: null,
            error,
        }
    }

    const email = user.email;
    const emailUser = await _getUsersByEmail(email);
    console.log(emailUser, emailUser.length);
    if (emailUser.length >= 1) {
        return {
            user: null,
            error: 'email already in use',
        }
    }

    const params = {
        TableName: USERS_TABLE,
        Item: user,
    };

    await dynamoDbClient.send(new PutCommand(params));
    return {
        user,
        error: null,
    };
}

async function updateUser(userId, userData) {
    const { user, error } = userModel.validateUserData(userData);
    if (error) {
        return {
            user: null,
            error,
        }
    }

    try {
        const email = user.email;
        const emailUser = await _getUsersByEmail(email);
        // checking for conditions where user detail like email cannot be used by another user!
        // phone number can/should also be handled the same way
        if (emailUser.length >= 1 && !emailUser.includes(userId)) {
            return {
                user: null,
                error: 'email already in use',
            }
        }

        const pk = "userId";
        const itemKeys = Object.keys(user).filter(k => k !== pk);
        const params = {
            TableName: USERS_TABLE,
            UpdateExpression: `SET ${itemKeys.map((k, index) => `#field${index} = :value${index}`).join(', ')}`,
            ExpressionAttributeNames: itemKeys.reduce((accumulator, k, index) => ({
                ...accumulator,
                [`#field${index}`]: k
            }), {}),
            ExpressionAttributeValues: itemKeys.reduce((accumulator, k, index) => ({
                ...accumulator,
                [`:value${index}`]: user[k]
            }), {}),
            Key: {
                [pk]: userId,
            },
            ReturnValues: 'ALL_NEW'
        };
        const { Attributes } = await dynamoDbClient.send(new UpdateCommand(params));
        return {
            user: Attributes,
            error: null,
        };
    } catch (err) {
        console.log(err);
        return {
            user: null,
            error: err,
        }
    }
}

async function deleteUser(userId) {
    const params = {
        TableName: USERS_TABLE,
        Key: {
            userId,
        },
    };

    const result = await dynamoDbClient.send(new DeleteCommand(params));
    console.log(result);
    return result;
}

async function _getUsersByEmail(email) {
    const params = {
        TableName: USERS_TABLE,
        IndexName: "GSI_email_sk",
        KeyConditionExpression: "#em = :v_em",
        ExpressionAttributeNames: {
            "#em": "email",
        },
        ExpressionAttributeValues: {
            ":v_em": email,
        }
    };

    const { Items } = await dynamoDbClient.send(new QueryCommand(params));
    return Items.map(i => i.userId);
}

module.exports = {
    getUser,
    createUser,
    updateUser,
    deleteUser,
};
