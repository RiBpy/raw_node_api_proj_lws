/*
App:up/down link
using core node modules
date: 21/07/2022
*/
// dependencies
const http = require('http')
const { ReqResHandler } = require('./helpers/ReqResHandler')

// app- object scaffolding
const app = {}

// configure the port
app.config = {
    port: 2225,
}

// create the server
app.createServer = () => {
    const server = http.createServer(app.ReqResHandler)
    server.listen(app.config.port, () => {
        console.log(`Server is running on port: ${app.config.port}`)
    })
}
// req response
app.ReqResHandler = ReqResHandler
// start server
app.createServer()
