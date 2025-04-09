//comp/body/page.js
import React from 'react';
import styles from './body.module.css';

const Page = ({ children }) => {
  return <div className={styles.page}>{children}</div>;
};

export default Page;