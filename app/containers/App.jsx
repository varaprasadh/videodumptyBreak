import React, { Component } from 'react'
import styles from "./styles/app.css";
import finger from "./assets/pointing-right.svg";
import ding_sound from "./assets/ding.mp3";


import Select from 'react-select';
import { toast } from 'react-toastify';
import { ipcRenderer } from 'electron';
import ProgressBar from './components/ProgressBar';

export class App extends Component {
    
    constructor(props){
        super(props);
        this.state={
          selected_photo_type: {
              value: "png",
              label: 'PNG'
          },
          inputVideo:null,
          outputFolder:null,
          op_width:"",
          op_height:"",
          destination_folder_name:"",
          dingEnabled:true,
          percent:0,
          processing:false
        }
        this.handleInputVideoFile = this.handleInputVideoFile.bind(this);
    }
    componentDidMount(){
        
        ipcRenderer.on('got-video-resolution', (event, res) => {
            console.log("got res", res)
            this.setState({
                op_width: `${res.width}`,
                op_height: `${res.height}`
            })

        });
        ipcRenderer.on('process-progress',(event,args)=>{
            //change progress state
            console.log("progress",args);
            let progress = Math.ceil(args.percent);
            this.setState({
                percent:progress
            })
        })
        ipcRenderer.on('process-progress-done',(event)=>{
            //hide progress and reset its state
           console.log("hide progress bar");
           if(this.state.dingEnabled){
               this._ding.play(); 
           }
           this.setState({
               processing:false,
               percent:0
           });
           toast.success("process completed");
        });
        ipcRenderer.on('error',(event)=>{
            this.resetApp();
            toast.error("something went wrong");
        })
    }
    
    handlePhotoTypeChange(option){
        this.setState({
            selected_photo_type:option
        });
    }
  handleInputVideoFile(file) {
      
     ipcRenderer.send('get-video-resolution',file.path);
     let _filename;
      this.setState({
          inputVideo: file,
          destination_folder_name: file.name.split(".").slice(0,-1).join(".")+ "/",
      });
  }
  handleOutputFolder(file) {
      console.log(file)
     this.setState({
         outputFolder:file
     })
  }

   breakApart(){
    //   console.log(this.state);

     let {inputVideo,outputFolder,op_width,op_height,destination_folder_name,selected_photo_type}=this.state;
     if(inputVideo!=null &&  op_width.trim()!='' && op_height.trim()!=''&& destination_folder_name.trim()!=''){
         toast.success("processing started...");
         //send this data to main process
         let __outputFolderpath = inputVideo.path;
         if (__outputFolderpath.indexOf("\\") != -1) {
             __outputFolderpath = __outputFolderpath.split("\\").slice(0, -1).join("/");
         } else {
             __outputFolderpath = __outputFolderpath.split("/").slice(0, -1).join("/");
         }
         let _outputFolder=outputFolder||{path:__outputFolderpath}
         let obj = {
             inputVideo:inputVideo.path,
             outputFolder: _outputFolder.path,
             op_width,
             op_height,
             destination_folder_name,
             selected_photo_type
         }
         ipcRenderer.send('process-video',obj);
         this.setState({
             processing:true
         });
         //show progressbar
     }else{
         toast.error("please check the inputs once");

     }


   }
   resetApp(){
      this.setState({
          reset:true
      },()=>{
          setTimeout(()=>{
              this.setState({
                  reset:false
              },()=>{
                  this.setState(
                      {
                            selected_photo_type: {
                                value: 0,
                                label: 'PNG'
                            },
                            inputVideo:null,
                            outputFolder:null,
                            op_width:'',
                            op_height:'',
                            destination_folder_name:"",
                            dingEnabled:true
                        }
                  )
              });
          },100)
      })
   }
   onWidthChange({target}){
      this.setState({
          op_width:target.value
      })
   }
   onHeightChange({target}){
     this.setState({
         op_height:target.value
     })
   }
   destinitionFolderNameChange({target}){
        this.setState({
            destination_folder_name:target.value
        })
   }
   cancelOperation(){
     ipcRenderer.send('kill-process');
     this.setState({
         percent:0,
         processing:false
     });
   }
   appDragover(e){
     event.preventDefault();
     e.dataTransfer.dropEffect = "none";
   }
   appDragstart(e){
    e.dataTransfer.dropEffect = "none";
   }
   appDragend(e){
     e.dataTransfer.dropEffect = "none";
   }
 
    render() {
        const options = [{
                value: "png",
                label: 'PNG'
            },
            {
                value: "jpg",
                label: 'JPEG'
            },
        ]
        let {inputVideo,outputFolder,op_width,op_height,destination_folder_name}=this.state;
        let buttonEnabled = (inputVideo != null && op_width.trim() != '' && op_height.trim() != '' && destination_folder_name.trim() != '');
        
        var {name=""}=this.state.inputVideo||{}
        let inputVideoTitle=name;
        var {path=""} =this.state.inputVideo||{};
         let _outputFolderTitle = path;
         console.log("deug",_outputFolderTitle);
        if (path.indexOf("\\") != -1) {
            _outputFolderTitle = path.split("\\").slice(0,-1).join("/");
        } else {
            _outputFolderTitle = path.split("/").slice(0,-1).join("/")
        }
        console.log("deug", _outputFolderTitle);

        var {path="No Output Folder Location Set"}=this.state.outputFolder||{path:_outputFolderTitle}
        let outputFolderTitle=path;
        if(path.indexOf("\\")!=-1){
            outputFolderTitle=path.split("\\").pop()+"/";
        }else{
             outputFolderTitle = path.split("/").pop() + "/";
        }

        return (
            !this.state.reset &&
            <div className={styles.app} onDragOver={this.appDragover} onDragStart={this.appDragstart} onDragEnd={this.appDragend}>

                 <audio hidden src={ding_sound} ref={ding=>this._ding=ding}/>
                {
                    this.state.processing==true && <ProgressBar onCancel={this.cancelOperation.bind(this)} percent={this.state.percent}/>
                }
                  <div className={styles.row}>
                     <DropZone 
                       title="SET INPUT VIDEO"
                       onDropFile={(file)=>{ this.handleInputVideoFile(file); }}
                       label={inputVideoTitle}
                       type="video"
                       placeholder = "No Input Video Set"
                       />
                    <div>
                        <img src={finger} alt="pointer" className={styles.img_finger}/>
                    </div>
                    <div className={`${styles.column} `}>
                      <DropZone
                       title="SET OUTPUT FOLDER"
                        onDropFile={this.handleOutputFolder.bind(this)}
                        type="folder"
                        label={outputFolderTitle} 
                        placeholder = "No Output Folder Location Set"
                       />
                    </div>
                 </div>
                 <div className={`${styles.row} ${styles.prefs_row}`}>
                     <div className={styles.column}></div>
                     <div className={`${styles.column} ${styles.prefs}`}>
                       <div className={styles.op_box_}>
                            <input type="text" 
                             placeholder="..."
                             value={this.state.destination_folder_name}
                             onChange={this.destinitionFolderNameChange.bind(this)}
                             className={styles.op_box}/>
                       </div>
                        <div className={styles.res_box_wrapper}>
                            <input type="text" 
                            className={styles.res_box}
                            placeholder="Width"
                            value={this.state.op_width}
                            onChange={this.onWidthChange.bind(this)}
                            />
                            <div className={styles.res_box_cross}>X</div>
                            <input type="text"
                             className={styles.res_box}
                             placeholder="Height"
                             value={this.state.op_height}
                             onChange={this.onHeightChange.bind(this)}
                             />
                        </div>
                        <div className={styles.file_type_chooser}>
                            <div>File Type</div>
                            <div className={styles.select_box}>
                                <Select 
                                value={this.state.selected_photo_type}
                                onChange={this.handlePhotoTypeChange.bind(this)}
                                options={options} />
                            </div>
                        </div>
                     </div>
                 </div>
                 <div className={`${styles.row} ${styles.alignbottom}`}>
                      <div 
                        className={`${styles.btn} ${styles.reset}`}
                        onClick={this.resetApp.bind(this)}
                        >
                          RESET
                      </div>
                      <div className={styles.notif}>
                           <input className={styles.styled_checkbox} 
                           checked={this.state.dingEnabled}
                           onChange={({target:{checked}})=>this.setState({dingEnabled:checked})}
                           id="styled-checkbox-1" type="checkbox" value="value1"/>
                            <label htmlFor="styled-checkbox-1">Ding when done</label>
                      </div>
                      <div 
                         className={`${styles.btn} ${styles.break} ${buttonEnabled?"":styles.disabled}`}
                         onClick={this.breakApart.bind(this)}
                         >
                          BREAK APART
                      </div>
                 </div>  
            </div>
        )
    }
}

class DropZone extends Component{
 
    constructor(props){
        super(props);
        this.state={
            dragging:false,
            defaultLabelText: this.props.defaultLabelText
        }
        this.propagateFile = this.propagateFile.bind(this);
    }
   showDropOverlay(e){
      e.preventDefault()
      e.stopPropagation()
      this.setState({
          dragging:true
      })
   }
   hideDropOverlay(e){
       e.preventDefault()
       e.stopPropagation()
     this.setState({
         dragging: false,
     });
   }
   onDrop(event){
      
    this.hideDropOverlay(event);
    let file= event.dataTransfer.files[0];
    this.propagateFile(file);
   }

   propagateFile(file){
        let {name,path,type}=file;
    //check for input for errors!
    if(this.props.type==="video"){
        if (/video/.test(type)){
            this.props.onDropFile(file);
        }else{
            toast.error("choose video file");
        }
       
    }else if(this.props.type==="folder"){
        console.log("debug",type,path);
        if(type.trim()===""){
            this.props.onDropFile(file);
        }else{
            toast.error("choose a directory");
        }
    }
   }
    
     handleUploadClick(){
         let {type}=this.props;
         if(/video/.test(type)){
             this._fileInput.click()
         }else if(/folder/.test(type)){
             this._folderInput.click();
         }
     }
     handleFileChange({target}){
        let files=target.files;
        console.log(files);
        this.propagateFile(files[0]);
     }
    render(){
       
           //TODO 
        
      return(
          <div className={`${styles.column} ${styles.drop_container_wrapper}`}
                 onDragOver={ this.showDropOverlay.bind(this)}
                 onDragStart={this.showDropOverlay.bind(this)}
                 onDragLeave={this.hideDropOverlay.bind(this)}
                 onDrop={this.onDrop.bind(this)}
            onClick={this.handleUploadClick.bind(this)}
            >
            
            <input type="file"  hidden
                 ref={_ip=>this._folderInput=_ip}
                 directory="" webkitdirectory=""
                 hidden
                 onChange={this.handleFileChange.bind(this)}
            />  
            <input type="file"  hidden
                 ref={_ip=>this._fileInput=_ip}
                 hidden
                 accept="video/*"
                 onChange={this.handleFileChange.bind(this)}
            />  

          
            <div className={styles.alignstart}>
                {!this.state.dragging==true?(
                <div className={`${styles.drop_container}`}
                >
                    <div>{this.props.title}</div>
                </div>)
                :
                (<div className={`${styles.drop_overlay}`}
                 onDragOver={ this.showDropOverlay.bind(this)}
                 onDragStart={this.showDropOverlay.bind(this)}
                 onDragLeave={this.hideDropOverlay.bind(this)}
                 onDrop={this.onDrop.bind(this)}
                >
                    <img src={require("./assets/download.png")} alt="drop icon"/>
                    <div>DROP HERE</div>
                </div>)
                }  
                <div className={styles.videoTitle}>
                  {
                    this.props.label.replace("/","")!=""?this.props.label:this.props.placeholder
                  }
                </div>
            </div>
        </div>
      )
  }
    
}

export default App
