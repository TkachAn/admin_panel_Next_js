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
