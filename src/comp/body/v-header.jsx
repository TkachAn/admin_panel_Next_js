//src/comp/body/header.jsx
"use client";
import React, { useState, useEffect } from "react";
import Logotype from "../logo/logo";
import Vnavbar from "../navbar/v-navbar";
import styles from "./body.module.css";
import { LogoPic } from "../logo/logoPic";

const Vheader = () => {
  return (
    <header className={styles.vheaderVisible}>
      <div className={styles.vline_up}>
        <LogoPic />
        <Vnavbar isOpen={true} closeMenu={false} />
      </div>
    </header>
  );
}

export default Vheader;
