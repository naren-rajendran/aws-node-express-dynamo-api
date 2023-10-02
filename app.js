const express = require("express");
const bodyParser = require("body-parser");

// db
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
} = require("@aws-sdk/lib-dynamodb");
const { USERS_TABLE, DB_PORT, AWS_REGION, STAGE } = process.env;

const dynamoDbClientParams = {};
if (process.env.IS_OFFLINE) {
    dynamoDbClientParams.region = AWS_REGION;
    dynamoDbClientParams.endpoint = `http://localhost:${DB_PORT}`;
}
const client = new DynamoDBClient(dynamoDbClientParams);
const dynamoDbClient = DynamoDBDocumentClient.from(client);
const tableName = `${USERS_TABLE}-${STAGE}`;

// app
const app = express();
app.use(bodyParser.json());

app.get("/users/:userId", async function (req, res) {
    const params = {
        TableName: tableName,
        Key: {
            userId: req.params.userId,
        },
    };

    try {
        const { Item } = await dynamoDbClient.send(new GetCommand(params));
        if (Item) {
            const { userId, name } = Item;
            res.json({ userId, name });
        } else {
            res
                .status(404)
                .json({ error: 'Could not find user with provided "userId"' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Could not retreive user" });
    }
});

app.post("/users", async function (req, res) {
    const { userId, name } = req.body;
    console.log(req.body);
    if (typeof userId !== "string") {
        res.status(400).json({ error: '"userId" must be a string' });
        return;
    } else if (typeof name !== "string") {
        res.status(400).json({ error: '"name" must be a string' });
        return;
    }

    const params = {
        TableName: tableName,
        Item: {
            userId: userId,
            name: name,
        },
    };

    try {
        await dynamoDbClient.send(new PutCommand(params));
        return res.json({ userId, name });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Could not create user" });
        return;
    }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
