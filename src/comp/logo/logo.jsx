import React from 'react';
import styles from './logo.module.css';

const Logotype = () => {
  return <div className={styles.logotype}>
    <div>
    <img src="/1flash.png" alt="1flash" className={styles.logoImg}/>

    </div>
    <div className={styles.logoFo}>
    <span className={styles.logoName}>Не</span> 
    <span className={styles.logoTo}>наеби! <span  className={styles.logoDo}>ближнего своего</span></span> 
    </div>
      
    </div>

};

export default Logotype;
//Учёт