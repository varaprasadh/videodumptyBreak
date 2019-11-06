/* eslint-disable prefer-const */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */

const path=require('path');
const fs=require('fs');

const FFMPEG_PATH = require('ffmpeg-static').path.replace('app.asar', 'app.asar.unpacked');
const FFPROBE_PATH = require('ffprobe-static').path.replace('app.asar', 'app.asar.unpacked')
const fluentFFmpeg=require('fluent-ffmpeg');


console.log(FFMPEG_PATH);
function breakVideo({destination_folder_name,inputVideo,op_height,op_width,outputFolder,selected_photo_type}){
   let op_ext = selected_photo_type.value;
       // eslint-disable-next-line prefer-template
       let _output_path = path.join(outputFolder, destination_folder_name.replace('/',"")+"/");
       console.log(_output_path, "heheh");
       if (!fs.existsSync(_output_path)) {
           fs.mkdirSync(_output_path);
       }

    let process = fluentFFmpeg({ source:inputVideo });
    process.setFfmpegPath(FFMPEG_PATH);
    process.setFfprobePath(FFPROBE_PATH);
    process.addOption(`-vf scale='${op_width}':'${op_height}'`)
    process.save(`${_output_path}%8d.${op_ext}`);

   return process;
}

module.exports=breakVideo;



