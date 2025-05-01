
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
