//src/comp/body/footer.js
import React from 'react';
import styles from './body.module.css';
import Container from './container';

const Footer = ({ children}) => {
  return <footer className={styles.footer}>
    <Container>
    {children} &copy; 2025 Garden plots

    </Container>
    </footer>;
};

export default Footer;