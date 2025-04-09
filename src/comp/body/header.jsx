//src/comp/body/header.jsx
'use client';
import React, { useState, useEffect } from "react";
import Logotype from "../logo/logo";
import Navbar from "../navbar/navbar";
import styles from "./body.module.css";
import Container from "./container";
import HamburgerIcon from "./HamburgerIcon";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreen(); // при монтировании
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const toggleMenu = () => setMenuOpen(prev => !prev);

  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.line_up}>
          <Logotype />
          {isMobile ? (
            <div className={styles.hamburgerWrapper}>
              <HamburgerIcon onClick={toggleMenu} />
            </div>
          ) : (
            <Navbar isOpen={false} /> // обычное меню на десктопе
          )}
        </div>

        {menuOpen && isMobile && (
          <div className={styles.modalMenu} onClick={() => setMenuOpen(false)}>
            <div onClick={(e) => e.stopPropagation()} className={styles.navbar}>
              <Navbar isOpen={menuOpen} closeMenu={() => setMenuOpen(false)} />
            </div>
          </div>
        )}
      </Container>
    </header>
  );
};

export default Header;



// src/comp/body/header.jsx
/*
'use client';
import React, { useState } from "react";
import Logotype from "../logo/logo";
import Navbar from "../navbar/navbar";
import styles from "./body.module.css";
import Container from "./container";
import HamburgerIcon from "./HamburgerIcon";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(prev => !prev);

  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.line_up}>
          <Logotype />
          <div className={styles.hamburgerWrapper}>
            <HamburgerIcon onClick={toggleMenu} />
          </div>
        </div>
        <Navbar isOpen={menuOpen} closeMenu={() => setMenuOpen(false)} />
      </Container>
    </header>
  );
};

export default Header;
*/

/*
'use client';

import React, { useState } from "react";
import Logotype from "../logo/logo";
import Navbar from "../navbar/navbar";
import styles from "./body.module.css";
import Container from "./container";
import HamburgerIcon from "./HamburgerIcon";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen((prev) => !prev); // Переключаем состояние меню
  };

  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.line_up}>
          <Logotype />
          <HamburgerIcon onClick={toggleMenu} />
        </div>

       
        {menuOpen && (
          <div className={styles.modalMenu}>
            <Navbar isOpen={menuOpen} />
          </div>
        )}
        <Navbar isOpen={false} />
      </Container>
    </header>
  );
};

export default Header;
*/

/*
'use client'; 
import React, { useState } from "react";
import Logotype from "../logo/logo";
import Navbar from "../navbar/navbar";
import styles from "./body.module.css";
import Container from "./container";
import HamburgerIcon from "./HamburgerIcon";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.line_up}>
          <Logotype />
          <HamburgerIcon onClick={toggleMenu}/>
          <Navbar isOpen={menuOpen} />
        </div>
        {menuOpen && (
          <div className={styles.modalMenu}> 
            <Navbar isOpen={menuOpen} />
          </div>
        )}
      </Container>
    </header>
  );
};


export default Header;

*/