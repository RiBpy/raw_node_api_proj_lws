//dependencies 
const data=require('../../lib/data')
const {hash}=require('../../helpers/utilities');
const {parsedData}=require("../../helpers/utilities")
const tokenHandler =require("./tokenHandler")
//const { user } = require('../../route');

const handler = {};
handler.userHandler = (requestProperties, callBack) => {
    const acceptedMethod=["post","get","put","delete"];
    if(acceptedMethod.indexOf(requestProperties.method)>-1){//in requestProperties.method we get what a request method is ,so if me requested method is in the accepted list then indexOf method will return index 
handler.users[requestProperties.method](requestProperties,callBack)
    }else{
        callBack(405)
    }
};
handler.users={};
handler.users.post=(requestProperties,callBack)=>{
 const firstName=typeof requestProperties.body.firstName==="string" && requestProperties.body.firstName.trim().length>0?requestProperties.body.firstName:false
 const lastName=typeof requestProperties.body.lastName==="string" && requestProperties.body.lastName.trim().length>0?requestProperties.body.lastName:false
 const phone=typeof requestProperties.body.phone==="string" && requestProperties.body.phone.trim().length===11?requestProperties.body.phone:false
 const password=typeof requestProperties.body.password==="string" && requestProperties.body.password.trim().length>0?requestProperties.body.password:false
 const tosAgreement=typeof requestProperties.body.tosAgreement==="boolean" && requestProperties.body.tosAgreement===true?requestProperties.body.tosAgreement:false
 if(firstName && lastName && phone && password && tosAgreement){
    //to check if the user already exist
    data.read('users',phone,(err)=>{//taking phone number as unique value
        //if any error happen that means user is not registered
    if(err){
    let userObject ={
        firstName,
        lastName,
        phone,
        password:hash(password),
        tosAgreement,
    }
    //store to database
    data.create("users",phone,userObject,(err)=>{
        if(!err){
        callBack(200,{
            message:"Successfully created user"
        })
        }else{
            callBack(500,{
                error:"Error while creating user"
            })
        }
    })
    }else{
        callBack(500,{
            error:"May be you are previously registered"
        })
    }
    })
 }else{
    callBack(400,{error:"May be you did not provide all required field"})
 }

}
handler.users.get=(requestProperties,callBack)=>{
    //phone number will be in queryString .what was in requestProperties.
    const phone=typeof requestProperties.queryString.phone==="string" && requestProperties.queryString.phone.trim().length===11?requestProperties.queryString.phone:false
    if(phone){
        //token verify
        const token=typeof requestProperties.headersObj.token==="string" && requestProperties.headersObj.token.trim().length===20?requestProperties.headersObj.token:false
        tokenHandler.token.verify(token,phone,(tokenId)=>{
           if(tokenId){
            data.read("users",phone,(err,user)=>{
                const userData={...parsedData(user)}//as user may not give proper object the parsedData will make it object and keep it in userData
               if(!err && userData){
                delete(userData.password)//cause we don't want to show password .
                callBack(200,userData)
               }else{
                callBack(404,{
                    error:"User found but data load failed"
                })
               }
            })
           }else{
            callBack(403,{
                error:"Authentication failed"
            })
           }
        })
   }else{
        callBack(404,{
            error:"User Not Found"
        })
    }

}
handler.users.put=(requestProperties,callBack)=>{
    const phone=typeof requestProperties.body.phone==="string" && requestProperties.body.phone.trim().length===11?requestProperties.body.phone:false
    const firstName=typeof requestProperties.body.firstName==="string" && requestProperties.body.firstName.trim().length>0?requestProperties.body.firstName:false
    const lastName=typeof requestProperties.body.lastName==="string" && requestProperties.body.lastName.trim().length>0?requestProperties.body.lastName:false
    const password=typeof requestProperties.body.password==="string" && requestProperties.body.password.trim().length>0?requestProperties.body.password:false
    //check if provided phone is in the database ,cause we did use phone as unique field.
    if(phone){
        if(firstName || lastName || password){
            const token=typeof requestProperties.headersObj.token==="string" && requestProperties.headersObj.token.trim().length===20?requestProperties.headersObj.token:false
        tokenHandler.token.verify(token,phone,(tokenId)=>{
           if(tokenId){
            //lookup user
            data.read("users",phone,(err,user)=>{
                //delete user.tosAgreement;//we don't need agreement to checkup.
                const userData={...parsedData(user)}
            if(!err && userData){
                if(firstName){
                    userData.firstName=firstName
                }
                if(lastName){
                    userData.lastName=lastName
                }
                if(password){
                    userData.password=hash(password)
                }
                data.update("users",phone,userData,(err)=>{
                    if(!err){
                       callBack(200,{
                        message:"Data update successful"
                       })
                    }else{
                        callBack(400,{
                            error:"Data update process is failed"
                        })
                    }
                })
            }else{
                callBack(400,{
                    error:"Data Read is Unsuccessful"
                })
            }
               })
           }else{
            callBack(403,{
                error:"Authentication failed"
            })
           }
        })}else{
            callBack(400,{
                error:"Your request was not appropriate"
            })
        }
    }else{
        callBack(404,{
            error:"User not found in database"
        })
    }
}
handler.users.delete=(requestProperties,callBack)=>{
    const phone=typeof requestProperties.queryString.phone==="string" && requestProperties.queryString.phone.trim().length===11?requestProperties.queryString.phone:false
    if(phone){
        //token verify
        const token=typeof requestProperties.headersObj.token==="string" && requestProperties.headersObj.token.trim().length===20?requestProperties.headersObj.token:false
        tokenHandler.token.verify(token,phone,(tokenId)=>{
           if(tokenId){
            //data check in database
            data.read("users",phone,(err,user)=>{
                if(!err && user){
                   data.delete("users",phone,(err)=>{
                    if(!err){
                      callBack(200,{
                        message:"Successful deleted data"
                      })
                    }else{
                        callBack(500,{
                            error:"Data delete unsuccessful"
                        })
                    }
                   })
                }else{
                    callBack(500,{
                        error:"Data read is unsuccessful"
                    })
                }
              })
           }else{
            callBack(403,{
                error:"Authentication failed"
            })
           }
        })
    }else{
        callBack(400,{
            error:"Data was not there to delete"
        })
    }
 
}
module.exports = handler;
