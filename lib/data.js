const fs=require("fs");
const path=require("path");
const lib ={};
lib.basedir=path.join(__dirname,'/../.data/') //file will be written in .data folder.
lib.create=(dir,file,data,callback)=>{//folder name, file name inside the folder,data inside that file,and a callback function which will manage error and other details..
    fs.open(`${lib.basedir+dir}/${file}.json`,'wx',(err,fileDescriptor)=>{
//folder/file.json/ 'wx-file system flag'-file open for writing and fails if the file already exist..we could use 'w-filesystem flag' but it will override data of the file if already exist.
if(!err&& fileDescriptor){//here fileDescriptor will contain details of the file.
    //convert Data into string
const stringData=JSON.stringify(data);
//write data to the file and close it
fs.writeFile(fileDescriptor,stringData,(err2)=>{
    if(!err2){
        //after writing close the file
        fs.close(fileDescriptor,(err3)=>{//check if the file is closing successfully
          if(!err3){
            //if closing is done,then callback will be false
            callback(false)
          }else{
            callback("Error closing the new file")
          }
        })
    }else{
        callback("Error while writing to the file")
    }
})
}else{
callback("Could not open new file,it may be already exist!")
}
    })

}

//file read.
lib.read=(dir,file,callback)=>{
    fs.readFile(`${lib.basedir+dir}/${file}.json`,'utf8',(err,data)=>{
        callback(err,data);
    })
}

//updating data
lib.update=(dir,file,data,callback)=>{
    fs.open(`${lib.basedir+dir}/${file}.json`,"r+",(err,fileDescriptor)=>{ //"r+ file system flag" for reading and writing ,if given data already exist then error.
      if(!err && fileDescriptor){
          //convert the data to string
          const stringData=JSON.stringify(data);
          //ftruncate(clear) the file to update
          fs.ftruncate(fileDescriptor,(err)=>{
            if(!err){
                //write given data as stringData in the file and close it 
                fs.writeFile(fileDescriptor,stringData,(err)=>{
                    if(!err){
                        //close the file 
                        fs.close(fileDescriptor,(err)=>{
                            if(!err){
                                callback(false)
                            }else{
                                callback("Error in closing the file")
                            }
                        })
                    }else{
                        callback("Error while writing the file")
                    }
                })
            }else{
                callback("Error while truncating the file")
            }
          })
      }else{
       callback("Error in file opening")
      }
    })
    }

//delete existing file
lib.delete=(dir,file,callback)=>{
    fs.unlink(`${lib.basedir+dir}/${file}.json`,(err)=>{
        if(!err){
            callback(false)
        }else{
            callback("Error in deleting")
        }
    })
}
module.exports=lib