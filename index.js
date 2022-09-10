/*
App:up/down link
using core node modules
date: 21/07/2022
*/
// dependencies
const http = require('http');
const { ReqResHandler } = require('./helpers/ReqResHandler');
const environment = require('./helpers/environments');
const data=require('./lib/data')

// app- object scaffolding
const app = {};

//testing file system

//create data
// data.create('test','newFile',{name:"BD",language:"Bangla"},(err)=>{//fs in lib/data file will create a file called newFile in test subfolder inside .data folder consisting the given object.
//     console.log("ERROR IS ",err)
// })


//data reading
// data.read('test',"newFile",(err,res)=>{//subfolder name in .data folder,fileName ,callback
//     console.log(err,res)
// })

// //updating data 
// data.update('test',"newFile",{name:'Kuwait',language:"Arabic"},(err)=>{//subfolder name in .data folder,fileName ,callback
//     console.log(err)
// })

//deleting the file
data.delete('test',"newFile",(err)=>{
 console.log(err)
});

// create the server
app.createServer = () => {
    const server = http.createServer(app.ReqResHandler);
    server.listen(environment.port, () => {
        console.log(`Server is running on port: ${environment.port}`);
    });
};
// req response
app.ReqResHandler = ReqResHandler;
// start server
app.createServer();
