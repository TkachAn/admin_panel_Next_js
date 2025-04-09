//src/comp/navbar/navbar.jsx
import React from 'react';
import Link from 'next/link';
import LogoutButton from '../../elem/logoutButton';
import styles from './navbar.module.css';
//import styles from '../body/body.module.css';

const Navbar = ({ isOpen, closeMenu  }) => {
  return (
    <nav className={`${styles.navbar} ${isOpen ? styles.open : ''}`}>
    
      {/*<ul className={styles.navList}>*/}
      <ul className={styles.navList} onClick={closeMenu}>
        <li className={styles.navItem}>
          <Link href="/">Главная</Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/admin">Админ Панель</Link>
        </li>
        
        <li className={styles.navItem}>
        <LogoutButton/>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
//<LogoutButton/> <nav className={styles.navbar}>