// dependencies
const url = require('url');
const { StringDecoder } = require('string_decoder'); //StringDecoder class of string_decoder core module..
const routes = require('../route');
const { notFoundHandler } = require('../handlers/routeHandlers/notFoundHandler');

// handler scaffolding
const handler = {};

// request and response handler.
handler.ReqResHandler = (req, res) => {
    // req handling
    // get the url
    const parsedUrl = url.parse(req.url, true);//req.url contains full url,true indicates if any query string[localhost:3000/(a=2&b=2?)-query string ]is present in url,then they will also be considered.
    console.log(parsedUrl)
    // get the path..in pathUrl object we get lots of property ,of them path name is one....localhost:3000/about ..here /about is the path
    const path = parsedUrl.pathname;
    // trim the path to avoid /  in starting and ending..localhost:3000///about/..here 2 extra slash after 3000 and last slash will be replaced by ''
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    // get the query...localhost:3000/about?a=5&b=6...here {a=5,b=6}is the result
    const queryString = parsedUrl.query;
    // get the method
    const method = req.method.toLowerCase();
    // get the headers...meta data sending with the request..like i can send my name as name=ri as meta data..
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
   
    const decoder = new StringDecoder('utf-8'); // to receive and make real existence of data from payload(postman>body>raw)
    let realData = '';   //string  -where data will be added.
    req.on('data', (buffer) => {/// listening data event /decode buffer what we get from payload
        realData += decoder.write(buffer);//
    });
    req.on('end', () => {//after completion of all data to end buffering of data end event will be called and decoder.end will end buffering
        realData += decoder.end();

        chosenHandler(requestProperties, (statusCode, payload) => {  //chosenHandler will tow properties requestProperties and a callback function
            statusCode = typeof statusCode === 'number' ? statusCode : 500;//set if statuscode is given in number formate or set as default 500
            payload = typeof payload === 'object' ? payload : {};//set if statuscode is given in number formate or set as default 500
            const payloadString = JSON.stringify(payload);
            // return final response
            res.writeHead(statusCode);
            res.end(payloadString);
        });
        
        console.log(realData);
        res.end('Data finished');
    });
};
module.exports = handler;
