//src/comp/body/header.jsx

"use client";
import React, { useState, useEffect } from "react";
import Logotype from "../logo/logo";
import MultiLevelAccordion from "../navbar/multiBar";
import styles from "./body.module.css";
import Container from "./container";
import HamburgerIcon from "./HamburgerIcon";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isWideDesktop, setIsWideDesktop] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      const mobile = window.innerWidth <= 768;
      const wideDesktop = window.innerWidth > 1440;
      setIsMobile(mobile);
      setIsWideDesktop(wideDesktop);
      console.log(
        "Current window width:",
        window.innerWidth,
        "isMobile:",
        mobile,
        "isWideDesktop:",
        wideDesktop
      );
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <header
      className={isWideDesktop ? styles.vheaderVisible : styles.headerVisible}
    >
      <Container>
        <div className={isWideDesktop ? styles.vline_up : styles.line_up}>
          <Logotype />
          {isMobile ? (
            <div className={styles.hamburgerWrapper}>
              <HamburgerIcon onClick={toggleMenu} />
            </div>
          ) : (
            <MultiLevelAccordion
              className={
                isWideDesktop
                  ? styles.desktop_vertical
                  : styles.desktop_horizontal
              }
              isMobile={isMobile} // Передаем isMobile как пропс
              isWideDesktop={isWideDesktop} // Передаем isWideDesktop как пропс
            />
          )}
        </div>

        {menuOpen && isMobile && (
          <div className={styles.modalMenu} onClick={() => setMenuOpen(false)}>
            <div
              onClick={(e) => e.stopPropagation()}
              className={styles.mobileNavbar}
            >
              <MultiLevelAccordion isMobile={true} />
            </div>
          </div>
        )}
      </Container>
    </header>
  );
};

export default Header;

/*
"use client";
import React, { useState, useEffect } from "react";
import Logotype from "../logo/logo";
import MultiLevelAccordion from "../navbar/multiBar";
import menuItemsW from "../navbar/multiMenu";
import styles from "./body.module.css";
import Container from "./container";
import HamburgerIcon from "./HamburgerIcon";

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isWideDesktop, setIsWideDesktop] = useState(false);

    useEffect(() => {
        const checkScreen = () => {
            setIsMobile(window.innerWidth <= 768);
            setIsWideDesktop(window.innerWidth > 1440);
            console.log("Current window width:", window.innerWidth); // Добавили эту строку
        };

        checkScreen();
        window.addEventListener("resize", checkScreen);

        return () => window.removeEventListener("resize", checkScreen);
    }, []);

    const toggleMenu = () => setMenuOpen((prev) => !prev);

    return (
        <header className={isWideDesktop ? styles.vheaderVisible : styles.headerVisible}>
            <Container>
                <div className={isWideDesktop ? styles.vline_up : styles.line_up}>
                    <Logotype />
                    {isMobile ? (
                        <div className={styles.hamburgerWrapper}>
                            <HamburgerIcon onClick={toggleMenu} />
                        </div>
                    ) : (
                        <MultiLevelAccordion
                            menuItems={menuItemsW}
                            className={isWideDesktop ? styles.verticalMenu : styles.horizontalMenu}
                        />
                    )}
                </div>

                {menuOpen && isMobile && (
                    <div className={styles.modalMenu} onClick={() => setMenuOpen(false)}>
                        <div onClick={(e) => e.stopPropagation()} className={styles.mobileNavbar}>
                            <MultiLevelAccordion menuItems={menuItemsW} isMobile={true} />
                        </div>
                    </div>
                )}
            </Container>
        </header>
    );
};

export default Header;

/*
"use client";
import React, { useState, useEffect } from "react";
import Logotype from "../logo/logo";
import MultiLevelAccordion from "../navbar/multiBar";
import menuItemsW from "../navbar/multiMenu";
import styles from "./body.module.css";
import Container from "./container";
import HamburgerIcon from "./HamburgerIcon";

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);
    const [isWideDesktop, setIsWideDesktop] = useState(false);

    useEffect(() => {
        const checkScreen = () => {
            setIsMobile(window.innerWidth <= 768);
            setIsTablet(window.innerWidth > 768 && window.innerWidth <= 1024);
            setIsDesktop(window.innerWidth > 1024 && window.innerWidth <= 1440);
            setIsWideDesktop(window.innerWidth > 1440);
        };

        checkScreen();
        window.addEventListener("resize", checkScreen);

        return () => window.removeEventListener("resize", checkScreen);
    }, []);

    const toggleMenu = () => setMenuOpen((prev) => !prev);

    return (
        <header className={styles.headerVisible}>
            <Container>
                <div className={styles.line_up}>
                    <Logotype />
                    {isMobile ? (
                        <div className={styles.hamburgerWrapper}>
                            <HamburgerIcon onClick={toggleMenu} />
                        </div>
                    ) : (
                        <MultiLevelAccordion
                            menuItems={menuItemsW}
                            className={isWideDesktop ? styles.verticalMenu : styles.horizontalMenu}
                        />
                    )}
                </div>

                {menuOpen && isMobile && (
                    <div className={styles.modalMenu} onClick={() => setMenuOpen(false)}>
                        <div onClick={(e) => e.stopPropagation()} className={styles.mobileNavbar}>
                            <MultiLevelAccordion menuItems={menuItemsW} isMobile={true} />
                        </div>
                    </div>
                )}
            </Container>
        </header>
    );
};

export default Header;

/*
"use client";
import React, { useState, useEffect } from "react";
import Logotype from "../logo/logo";
import Navbar from "../navbar/navbar";
import styles from "./body.module.css";
import Container from "./container";
import HamburgerIcon from "./HamburgerIcon";

import MultiLevelAccordion from "../navbar/multiBar";
import menuItemsW from "../navbar/multiMenu";

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

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <header className={styles.headerVisible}>
      <Container>
        <div className={styles.line_up}>
          <Logotype />
          {isMobile ? (
            <div className={styles.hamburgerWrapper}>
              <HamburgerIcon onClick={toggleMenu} />
            </div>
          ) : (
            <MultiLevelAccordion menuItems={menuItemsW} isOpen={false} />
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
//<Navbar isOpen={false} /> // обычное меню на десктопе

// src/comp/body/header.jsx<Logotype />
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
