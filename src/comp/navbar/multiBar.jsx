//src/comp/navbar/multiBar.jsx
'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import menuItems from './multiMenu'; // Импортируем данные меню напрямую

import styles from './multi.module.css';

const MenuItem = ({ item, depth = 0, accordion, onAnyClick }) => {
    const [open, setOpen] = useState(item.open || false);
    const hasChildren = item.children && item.children.length > 0;
    const submenuRef = useRef(null);
    const parentRef = useRef(null);

    const toggle = () => {
        setOpen(!open);
        onAnyClick?.(item);
    };

    useEffect(() => {
        if (depth === 0 && open && submenuRef.current && parentRef.current) {
            const parentRect = parentRef.current.getBoundingClientRect();
            submenuRef.current.style.top = `${parentRect.height}px`;
            submenuRef.current.style.left = `0px`;
        } else if (depth > 0 && open && submenuRef.current) {
            // Для вложенных подменю можно настроить отображение справа или слева
            submenuRef.current.style.top = `0px`;
            submenuRef.current.style.left = `100%`; // Пример отображения справа
        } else if (submenuRef.current) {
            submenuRef.current.style.top = '';
            submenuRef.current.style.left = '';
        }
    }, [open, depth]);

    return (
        <li className={open ? styles.open : ''} ref={parentRef}>
            <div className={styles.linkWrapper} onClick={hasChildren ? toggle : undefined}>
                <Link href={item.href || '#'} onClick={e => hasChildren && e.preventDefault()}>
                    {item.label}
                </Link>
                {hasChildren && (
                    <span className={styles.toggleSign}>{open ? '[-]' : '[+]'}</span>
                )}
            </div>
            {hasChildren && open && (
                <ul className={depth === 0 ? styles.submenu : styles.leftsubmenu} ref={submenuRef}>
                    {item.children.map((child, i) => (
                        <MenuItem key={i} item={child} depth={depth + 1} accordion={accordion} onAnyClick={onAnyClick} />
                    ))}
                </ul>
            )}
        </li>
    );
};

export default function MultiLevelAccordion({ accordion = true, isMobile, isWideDesktop }) {
  console.log(`isMobile: ${isMobile}, isWideDesktop: ${isWideDesktop} `);
  const [activeItem, setActiveItem] = useState(null);

  const handleClick = (item) => {
    if (!accordion) return;
    setActiveItem(item === activeItem ? null : item);
  };

  let navClassName = '';
  let listClassName = '';

  if (isMobile) {
    navClassName = styles.mobile_vertical;
    listClassName = styles.mobile_list;
  } else if (isWideDesktop) {
    navClassName = styles.desktop_vertical;
    listClassName = styles.desktop_vertical_list;
  } else {
    navClassName = styles.desktop_horizontal;
    listClassName = styles.desktop_horizontal_list;
  }

  return (
    <nav className={navClassName}>
      <ul className={listClassName}>
        {menuItems.map((item, i) => (
          <MenuItem
            key={i}
            item={item}
            depth={0} // Устанавливаем начальную глубину
            accordion={accordion}
            onAnyClick={accordion ? () => handleClick(item) : undefined}
          />
        ))}
      </ul>
    </nav>
  );
}



/*
export default function MultiLevelAccordion({ menuItems, accordion = true, className, isMobile, isWideDesktop }) {
    console.log(`isMobile: ${isMobile}, isWideDesktop: ${isWideDesktop} `)
  const [activeItem, setActiveItem] = useState(null);

    const handleClick = (item) => {
        if (!accordion) return;
        setActiveItem(item === activeItem ? null : item);
    };

    let navClassName = '';
    let listClassName = '';

    if (isMobile) {
        navClassName = styles.mobile_vertical;
        listClassName = styles.mobile_list;
    } else if (isWideDesktop) {
        navClassName = styles.desktop_vertical;
        listClassName = styles.desktop_vertical_list;
    } else {
        navClassName = styles.desktop_horizontal;
        listClassName = styles.desktop_horizontal_list;
    }

    return (
        <nav className={navClassName}>
            <ul className={listClassName}>
                {menuItems.map((item, i) => (
                    <MenuItem
                        key={i}
                        item={item}
                        depth={0} // Устанавливаем начальную глубину
                        accordion={accordion}
                        onAnyClick={accordion ? () => handleClick(item) : undefined}
                    />
                ))}
            </ul>
        </nav>
    );
}

/*
'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import styles from './multi.module.css';

const MenuItem = ({ item, depth = 0, accordion, onAnyClick }) => {
    const [open, setOpen] = useState(item.open || false);
    const hasChildren = item.children && item.children.length > 0;
    const submenuRef = useRef(null);
    const parentRef = useRef(null);

    const toggle = () => {
        setOpen(!open);
        onAnyClick?.(item);
    };

    useEffect(() => {
        if (depth === 0 && open && submenuRef.current && parentRef.current) {
            const parentRect = parentRef.current.getBoundingClientRect();
            submenuRef.current.style.top = `${parentRect.height}px`;
            submenuRef.current.style.left = `0px`;
        } else if (depth > 0 && open && submenuRef.current) {
            // Для вложенных подменю можно настроить отображение справа или слева
            submenuRef.current.style.top = `0px`;
            submenuRef.current.style.left = `100%`; // Пример отображения справа
        } else if (submenuRef.current) {
            submenuRef.current.style.top = '';
            submenuRef.current.style.left = '';
        }
    }, [open, depth]);

    return (
        <li className={open ? styles.open : ''} ref={parentRef}>
            <div className={styles.linkWrapper} onClick={hasChildren ? toggle : undefined}>
                <Link href={item.href || '#'} onClick={e => hasChildren && e.preventDefault()}>
                    {item.label}
                </Link>
                {hasChildren && (
                    <span className={styles.toggleSign}>{open ? '[-]' : '[+]'}</span>
                )}
            </div>
            {hasChildren && open && (
                <ul className={depth === 0 ? styles.submenu : styles.leftsubmenu} ref={submenuRef}>
                    {item.children.map((child, i) => (
                        <MenuItem key={i} item={child} depth={depth + 1} accordion={accordion} onAnyClick={onAnyClick} />
                    ))}
                </ul>
            )}
        </li>
    );
};

export default function MultiLevelAccordion({ menuItems, accordion = true, className, isMobile }) {
    const [activeItem, setActiveItem] = useState(null);

    const handleClick = (item) => {
        if (!accordion) return;
        setActiveItem(item === activeItem ? null : item);
    };

    return (
       
          <nav className={`${className} ${isMobile ? styles.Vnav : styles.nav}`}>
            <ul className={isMobile ? styles.leftnav : styles.topnav}>
                {menuItems.map((item, i) => (
                    <MenuItem
                        key={i}
                        item={item}
                        depth={0} // Устанавливаем начальную глубину
                        accordion={accordion}
                        onAnyClick={accordion ? () => handleClick(item) : undefined}
                    />
                ))}
            </ul>
        </nav>
    );
}

/*
Я думаю сделать вот такие вот классы :

className= {styles.mobile_vertical}
className= {styles.desktop_horizontal}
className= {styles.desktop_left vertical}

Вместо вот этой вот непонятной фигни :(          <nav className={`${className} ${isMobile ? styles.Vnav : styles.nav}`}>
            <ul className={isMobile ? styles.leftnav : styles.topnav}>
)

Сейчас когда я убрал все стили у меня получается в мобильном варианте вертикальное меню прячется под гамбургер всё нормально В десктопе тоже вертикальное меню и сверхшироких экранах отображается слева вертикально то есть тоже правильно отображается то есть неправильно отображается только при обычном десктопе там надо поменять на горизонтальное 
*/

/*



'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './multi.module.css';

const MenuItem = ({ item, depth = 0, accordion, onAnyClick }) => {
  const [open, setOpen] = useState(item.open || false);

  const hasChildren = item.children && item.children.length > 0;

  const toggle = () => {
    setOpen(!open);
    onAnyClick?.(item);
  };

  return (
    <li className={open ? styles.open : ''}>
      <div className={styles.linkWrapper} onClick={hasChildren ? toggle : undefined}>
        <Link href={item.href || '#'} onClick={e => hasChildren && e.preventDefault()}>
          {item.label}
        </Link>
        {hasChildren && (
          <span className={styles.toggleSign}>{open ? '[-]' : '[+]'}</span>
        )}
      </div>
      {hasChildren && open && (
        <ul className={styles.submenu}>
          {item.children.map((child, i) => (
            <MenuItem key={i} item={child} depth={depth + 1} accordion={accordion} />
          ))}
        </ul>
      )}
    </li>
  );
};

export default function MultiLevelAccordion({ menuItems, accordion = true }) {
  const [activeItem, setActiveItem] = useState(null);

  const handleClick = (item) => {
    if (!accordion) return;
    setActiveItem(item === activeItem ? null : item);
  };

  return (
    <nav className={styles.nav}>
      <ul className={styles.topnav}>
        {menuItems.map((item, i) => (
          <MenuItem
            key={i}
            item={item}
            accordion={accordion}
            onAnyClick={accordion ? () => handleClick(item) : undefined}
          />
        ))}
      </ul>
    </nav>
  );
}
*/