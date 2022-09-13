/*
Handle all token
12-9-2022
*/
//dependencies 
const data=require('../../lib/data')
const {hash}=require('../../helpers/utilities');
const {createRandomString}=require('../../helpers/utilities');
const {parsedData}=require("../../helpers/utilities")
//const { user } = require('../../route');

const handler = {};
handler.tokenHandler = (requestProperties, callBack) => {
    const acceptedMethod=["post","get","put","delete"];
    if(acceptedMethod.indexOf(requestProperties.method)>-1){//in requestProperties.method we get what a request method is ,so if me requested method is in the accepted list then indexOf method will return index 
handler.token[requestProperties.method](requestProperties,callBack)
    }else{
        callBack(405)
    }
};
handler.token={};
handler.token.post=(requestProperties,callBack)=>{
 const phone=typeof requestProperties.body.phone==="string" && requestProperties.body.phone.trim().length===11?requestProperties.body.phone:false
 const password=typeof requestProperties.body.password==="string" && requestProperties.body.password.trim().length>0?requestProperties.body.password:false
if(phone && password){
   data.read("users",phone,(err,userData)=>{
    if(!err){
     let hashedPass=hash(password)
     if(hashedPass===parsedData(userData).password){
          let tokenId=createRandomString(20);
          let session=Date.now()+60*60*1000 //30 minutes in milliseconds   
          let tokenObject={
            phone,
            id:tokenId,
            session
          }
        data.create("tokens",tokenId,tokenObject,(err)=>{
            if(!err){
                callBack(200,{
                    message:"Token created"
                })
            }else{
                callBack(500,{
                    error:"Token Creation failed"
                })
            }
        })
     }else{
        callBack(500,{
            error:"Password did not match"
        })
     }
    }else{
        callBack(500,{
            error:"Data read failed"
        })
    }
   })
}else{
    callBack(400,{
        error:"Phone number or Password is incorrect"
    })
}
}
handler.token.get=(requestProperties,callBack)=>{
    const id=typeof requestProperties.queryString.id==="string" && requestProperties.queryString.id.trim().length===20?requestProperties.queryString.id:false
    if(id){
        data.read("tokens",id,(err,tokenInfo)=>{
            const token={...parsedData(tokenInfo)}//as user may not give proper object the parsedData will make it object and keep it in userData
           if(!err && token){
            callBack(200,token)
           }else{
            callBack(404,{
                error:"Token was found but data load failed"
            })
           }
    })}else{
        callBack(404,{
            error:"Token was Not Found"
        })
    }
}
handler.token.put=(requestProperties,callBack)=>{
    //extension request will come through extend;
    const id=typeof requestProperties.body.id==="string" && requestProperties.body.id.trim().length===20?requestProperties.body.id:false
    const extend=typeof requestProperties.body.extend==="boolean" && requestProperties.body.extend===true?true:false

    if(id && extend){
      data.read("tokens",id,(err,tokenInfo)=>{
        //making object of token
        let tokenObject=parsedData(tokenInfo)
        if(!err && tokenObject){
            //check if the token is already expired
         if(tokenObject.session>Date.now()){
             //means session running
             tokenObject.session=Date.now()+60*60*1000 //extend one hour
             data.update("tokens",id,tokenObject,(err)=>{
                if(!err){
                 callBack(200,{
                    message:"Successfully token extended "
                 })
                }else{
                    callBack(500,{
                        error:"Session extension failed"
                    })
                }
             })

         }else{
            callBack(400,{
                error:"Your are already expired"
            })
         }
        }else{
            callBack(500,{
                error:"There was a problem in reading token"
            })
        }
      })
    }else{
        callBack(400,{
            error:"Something wrong in your id or extension request"
        })
    }

}
handler.token.delete=(requestProperties,callBack)=>{
    const id=typeof requestProperties.queryString.id==="string" && requestProperties.queryString.id.trim().length===20?requestProperties.queryString.id:false
    if(id){
      data.read("tokens",id,(err,tokenInfo)=>{
        if(!err && tokenInfo){
           data.delete("tokens",id,(err)=>{
            if(!err){
              callBack(200,{
                message:"Successful deleted Token"
              })
            }else{
                callBack(500,{
                    error:"Token delete unsuccessful"
                })
            }
           })
        }else{
            callBack(500,{
                error:"Token read is unsuccessful"
            })
        }
      })
    }else{
        callBack(400,{
            error:"Token was not there to delete"
        })
    }
 
}
handler.token.verify=(id,phone,callBack)=>{
    data.read("tokens",id,(err,tokenInfo)=>{
        let tokenObject=parsedData(tokenInfo)
        if(!err && tokenObject){
            if(tokenObject.phone ===phone && tokenObject.session>Date.now()){
                callBack(true)
            }else{
                callBack(false)
            }
        }else{
            callBack(false)
        }
    })
}
module.exports = handler;
