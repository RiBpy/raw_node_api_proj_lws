/*
utilities 
when user will send data it may not be a complete json file means exact field what we need.so check if it is json or not.If not then just empty object will be sent.
*/
//dependencies 
const crypto=require("crypto")
const environment=require('./environments')
const utilities={}

utilities.parsedData=(jsonString)=>{
let output;
    try {
        output= JSON.parse(jsonString)
    } catch{
        output={}
    }
return output;
}

utilities.hash=(str)=>{
if(typeof(str==="string" && str.length>0)){
    const hash=crypto
    .createHmac('sha256', environment.secretKey)
    .update(str)
    .digest('hex');
    return hash 
}else{
    return false
}
}
utilities.createRandomString=(strLength)=>{
  if(typeof(strLength)==="number"){
    let stringOut="";
    let possibleStr="abcdefghijklmnopqrstuvwxyz0123456789"
    for(let i=1 ; i<=strLength; i++){
        stringOut+=possibleStr.charAt(Math.floor(Math.random()*possibleStr.length))
    }
    return stringOut;
  }else{
    return "Provide string length in number"
  }
}
module.exports=utilities;