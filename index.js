const serverless = require("serverless-http");
const app = require("./app");

module.exports.handler = serverless(app);

// app.listen(3000, () => {
//     console.log('express app is running...');
// });
