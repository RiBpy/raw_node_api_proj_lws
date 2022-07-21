/*
App:up/down link
using core node modules
date: 21/07/2022
*/
// dependencies
const http = require('http');
const url = require('url');

// app- object scaffolding
const app = {};

// configure the port
app.config = {
    port: 2223,
};

// create the server
app.createServer = () => {
    const server = http.createServer(app.ReqResHandler);
    server.listen(app.config.port, () => {
        console.log(`Server is running on port ${app.config.port}`);
    });
};

// request and response handler.
app.ReqResHandler = (req, res) => {
    // req handling
    // get the url
    const parsedUrl = url.parse(req.url, true);
    // get the path
    const path = parsedUrl.pathname;
    // trim the path
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    // get the query
    const queryString = parsedUrl.query;
    // get the method
    const method = req.method.toLowerCase();
    // get the headers
    const { headers } = req;

    console.log(trimmedPath);
    res.end('Hello Programmers!');
};

// start server
app.createServer();
