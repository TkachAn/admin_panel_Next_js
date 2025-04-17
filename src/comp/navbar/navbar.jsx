//src/comp/navbar/navbar.jsx
/*
import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./navbar.module.css";
import { LogOutIconButton } from "@/elem/buttons/IconButtons";

const Navbar = ({ isOpen, closeMenu }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleAccordion = (section) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };

  return (
    <nav className={`${styles.navbar} ${isOpen ? styles.open : ""}`}>
      <ul className={styles.navList}>
        <li className={styles.navItem} onClick={closeMenu}>
          <Link href="/">Главная</Link>
        </li>
        <li className={styles.navItem} onClick={closeMenu}>
          <Link href="/admin">Админ Панель</Link>
        </li>
        <li className={styles.navItem} onClick={closeMenu}>
          <Link href="/readings">Новая запись</Link>
        </li>
        <li
          className={`${styles.navItem} ${styles.dropdown}`}
          onClick={() => isMobile && toggleAccordion("add")}
        >
          <div className={styles.dropdownToggle}>Добавить</div>
          <ul
            className={`${styles.subMenu} ${
              isMobile
                ? activeAccordion === "add"
                  ? styles.subMenuOpen
                  : ""
                : styles.subMenuDesktop
            }`}
          >
            <li className={styles.subNavItem} onClick={closeMenu}>
              <Link href="/his">Новый участок</Link>
            </li>
            <li className={styles.subNavItem} onClick={closeMenu}>
              <Link href="/counters">Новый счетчик</Link>
            </li>
            <li className={styles.subNavItem} onClick={closeMenu}>
              <Link href="/owners">Новый владелец</Link>
            </li>
          </ul>
        </li>
        <li className={styles.navItem}>
          <LogOutIconButton className={styles.logout} />
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
*/

import React, { useState } from "react";
import Link from "next/link";
import styles from "./navbar.module.css";
import { LogOutIconButton } from "@/elem/buttons/IconButtons";
import MultiLevelAccordionV from "./vertMultiBar";
import menuItemsW from "../navbar/multiMenu";
//import styles from '../body/body.module.css';

const Navbar = ({ isOpen, closeMenu }) => {
  const [isAddSubMenuOpen, setIsAddSubMenuOpen] = useState(false);

  const toggleAddSubMenu = () => {
    setIsAddSubMenuOpen(!isAddSubMenuOpen);
  };
  return (
    <MultiLevelAccordionV  menuItems={menuItemsW}/> 
   
  );
};

export default Navbar;
//<LogoutButton/> <nav className={styles.navbar}>
/*
 <nav className={`${styles.navbar} ${isOpen ? styles.open : ""}`}>
      
      <ul className={styles.navList} onClick={closeMenu}>
        <li className={styles.navItem}>
          <Link href="/">Главная</Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/admin">Админ Панель</Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/readings">Новая запись</Link>
        </li>
        <li className={styles.navItem} onClick={toggleAddSubMenu}>
          <span className={styles.dop} >Добавить</span>
          
          {isAddSubMenuOpen && (
            <ul className={styles.subMenu}>
              <li className={styles.subNavItem}>
                <Link href="/his">Новый участок</Link>
              </li>
              <li className={styles.subNavItem}>
                <Link href="/counters">Новый счетчик</Link>
              </li>
              <li className={styles.subNavItem}>
                <Link href="/owners">Новый владелец</Link>
              </li>
            </ul>
          )}
        </li>
        <li className={styles.navItem}>
          <LogOutIconButton className={styles.logout} />
        </li>
      </ul>
    </nav>
*/