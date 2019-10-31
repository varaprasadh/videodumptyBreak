
const FFmpeg = require('fluent-ffmpeg');

function getDimensions(path){
    console.log("new parh",path);


    // console.log(path)
    return new Promise((resolve,reject)=>{
        if (!path) {
            reject("path not specified");
        } else {
           var command = FFmpeg({
               source: path
           });
           command.ffprobe(0,(err,meta)=>{
               if(err) reject(err);
               let {width,height}=meta.streams[0];
               console.log({
                   width,
                   height
               });
              resolve({
                  width,
                  height
              });
           })
        }
    })
}



module.exports=getDimensions;
