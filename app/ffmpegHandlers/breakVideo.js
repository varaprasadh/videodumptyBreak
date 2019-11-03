const path=require('path');
const fs=require('fs');
const {FFMpegProgress} = require('ffmpeg-progress-wrapper');
const FFMPEG_PATH = require('ffmpeg-static').path.replace('app.asar', 'app.asar.unpacked')


console.log(FFMPEG_PATH);
function breakVideo({destination_folder_name,inputVideo,op_height,op_width,outputFolder,selected_photo_type}){
   let op_ext = selected_photo_type.value;
       let _output_path = path.join(outputFolder, destination_folder_name.replace('/',"")+"/");
       console.log(_output_path, "heheh");
       if (!fs.existsSync(_output_path)) {
           fs.mkdirSync(_output_path);
       }
    const process = new FFMpegProgress(['-i', `${inputVideo}`,
        '-vf', `scale='${op_width}':'${op_height}'`,
        `${_output_path}%8d.${op_ext}`
    ],{
        cmd:path.join(FFMPEG_PATH)
    });

   return process;
}

module.exports=breakVideo;



