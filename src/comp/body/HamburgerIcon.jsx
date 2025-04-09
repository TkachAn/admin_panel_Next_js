// src/comp/hamburgerIcon/HamburgerIcon.jsx
import React from 'react';
import styles from './body.module.css';

const HamburgerIcon = ({ onClick }) => {
  return (
    <div className={styles.hamburgerIcon} onClick={onClick}>
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
};

export default HamburgerIcon;
