// dependencies
const url = require('url');
const { StringDecoder } = require('string_decoder');
const routes = require('../route');
const { notFoundHandler } = require('../handlers/routeHandlers/notFoundHandler');

// handler scaffolding
const handler = {};

// request and response handler.
handler.ReqResHandler = (req, res) => {
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
    const headersObj = req.headers;
    const requestProperties = {
        parsedUrl,
        path,
        trimmedPath,
        queryString,
        method,
        headersObj,
    };
    // routes is an object .so by object[objectProperty] checking if trimmedPath is == any object property of routes obj
    const chosenHandler = routes[trimmedPath] ? routes[trimmedPath] : notFoundHandler; // here we can call it routes.trimmedPath ,but trimmedPath is not fixed value,its variable,thats how dynamic property name is declared;
    chosenHandler(requestProperties, (statusCode, payload) => {
        statusCode = typeof statusCode === 'number' ? statusCode : 500;
        payload = typeof payload === 'object' ? payload : {};
        const payloadString = JSON.stringify(payload);
        // return final response
        res.writeHead(statusCode);
        res.end(payloadString);
    });
    const decoder = new StringDecoder('utf-8'); // to receive and make real existence of data from payload(postman>body>raw)
    let realData = '';
    req.on('data', (chunk) => {
        realData += decoder.write(chunk);
    });
    req.on('end', () => {
        realData += decoder.end();
        console.log(realData);
        res.end('Data finished');
    });
};
module.exports = handler;
