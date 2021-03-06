

const FFmpeg = require('fluent-ffmpeg');
const FFMPEG_PATH = require('ffmpeg-static').path.replace('app.asar', 'app.asar.unpacked')
const FFPROBE_PATH = require('ffprobe-static').path.replace('app.asar', 'app.asar.unpacked')


const FFMPEG_PATH = require('ffmpeg-static').path.replace('app.asar', 'app.asar.unpacked')
const FFPROBE_PATH = require('ffprobe-static').path.replace('app.asar', 'app.asar.unpacked')


function getDimensions(path){
  
    console.log("got path at getdimentions",path)
    return new Promise((resolve,reject)=>{
        if (!path) {
            reject(new Error("path not specified"));
        } else {
        const command = FFmpeg({
               source: path
           });
          
           command.setFfmpegPath(FFMPEG_PATH); 
           command.setFfprobePath(FFPROBE_PATH);
           command.ffprobe(0,(err,meta)=>{
               if(err) reject(err);
               console.log(meta.streams);
               let videos_stream=meta.streams.find(({codec_type})=>codec_type=='video');

               const {width,height}=videos_stream;
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
