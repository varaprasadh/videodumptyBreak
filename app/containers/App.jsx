import React, { Component } from 'react'
import styles from "./styles/app.css";
import finger from "./assets/pointing-right.svg";

import Select from 'react-select';



export class App extends Component {
    render() {
        const options = [{
                value: 0,
                label: 'PNG'
            },
            {
                value: 1,
                label: 'JPEG'
            },
        ]
        return (
            <div className={styles.app}>
                 <div className={styles.row}>
                    <div className={`${styles.column} ${styles.drop_container_wrapper}`}>
                        <div className={styles.alignstart}>
                            <div className={styles.drop_container}>
                                <div>SET INPUT VIDEO</div>
                                <div className={styles.drop_overlay}>
                                <img src={require("./assets/download.png")} alt="drop icon"/>
                                <div>DROP HERE</div>
                                </div>
                            </div>
                            <div className={styles.videoTitle}>testing title</div>
                        </div>
                    </div>
                    <div>
                        <img src={finger} alt="pointer" className={styles.img_finger}/>
                    </div>
                    <div className={`${styles.column} `}>
                       <div className={styles.drop_container}>
                            <div>SET OUTPUT FOLDER LOCATION</div>
                            <div className={styles.drop_overlay}>
                               <img src={require("./assets/download.png")} alt="drop icon"/>
                               <div>DROP HERE</div>
                            </div>
                        </div>
                        <div className={styles.videoTitle}>testing title</div>
                    </div>
                 </div>
                 <div className={`${styles.row} ${styles.prefs_row}`}>
                     <div className={styles.column}></div>
                     <div className={`${styles.column} ${styles.prefs}`}>
                       <div className={styles.op_box_}>
                            <input type="text" className={styles.op_box}/>
                       </div>
                        <div className={styles.res_box_wrapper}>
                            <input type="text" className={styles.res_box}/>
                            <div className={styles.res_box_cross}>X</div>
                            <input type="text" className={styles.res_box}/>
                        </div>
                        <div className={styles.file_type_chooser}>
                            <div>File Type</div>
                            <div className={styles.select_box}>
                                <Select options={options} />
                            </div>
                        </div>
                     </div>
                 </div>
                 <div className={`${styles.row} ${styles.alignbottom}`}>
                      <div className={`${styles.btn} ${styles.reset}`}>
                          RESET
                      </div>
                      <div className={styles.notif}>
                           <input class={styles.styled_checkbox} id="styled-checkbox-1" type="checkbox" value="value1"/>
                            <label for="styled-checkbox-1">Ding when done</label>
                      </div>
                      <div className={`${styles.btn} ${styles.break}`}>
                          BREAK APART
                      </div>
                 </div>
                
            </div>
        )
    }
}

export default App
