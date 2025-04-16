//src/comp/navbar/navbar.jsx
import React from "react";
import Link from "next/link";
import styles from "./v-navbar.module.css";
import { LogOutIconButton } from "@/elem/buttons/IconButtons";
import { LogoutButton } from "@/elem/buttons/buttons";
//import styles from '../body/body.module.css';

const Vnavbar = ({ isOpen, closeMenu }) => {
  return (
    <nav className={styles.navbar}>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <Link href="/">Главная</Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/admin">Админ Панель</Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/his">Показания</Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/owners">Владельцы</Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/counters">Счетчики</Link>
        </li>
        <li className={styles.navItem}>
          <LogoutButton />
        </li>
      </ul>
    </nav>
  );
};

export default Vnavbar;

//<LogOutIconButton className={styles.logout}/>
