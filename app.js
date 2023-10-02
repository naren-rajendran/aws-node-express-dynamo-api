const express = require("express");
const bodyParser = require("body-parser");

// app
const app = express();
const userRoutes = require("./userRouter");
app.use(bodyParser.json());

// routes
app.get('/', function (req, res, next) {
    const apis = [{
        userAPIs: [
            { api: 'Get user', route: "/users/:userId", method: "GET" },
            { api: 'Create user', route: "/users", method: "POST" },
            { api: 'Update user', route: "/users/:userId", method: "PUT" },
            { api: 'Delete user', route: "/users/:userId", method: "DELETE" }
        ]
    }];

    return res.status(400).json(apis);
});

// user
app.use('/users', userRoutes);

// 404
app.use(function (req, res, next) {
    return res.json({ error: 'Not found' });
});

// 500
app.use(function (err, req, res, next) {
    console.log(err);
    return res.status(err.status || 500).json({
        message: err.message,
        error: {}
    });
});

module.exports = app;
