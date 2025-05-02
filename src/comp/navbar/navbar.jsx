//src/comp/navbar/navbar.jsx
import React, { useState } from "react";
import MultiLevelAccordionV from "./vertMultiBar";
import menuItemsW from "../navbar/multiMenu";

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
