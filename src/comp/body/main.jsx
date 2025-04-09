// src/components/main/main.jsx
import React from "react";
import styles from "./body.module.css";
import Container from "./container";

const Main = ({ children, title }) => {
  return (
    <main className={styles.main}>
      <Container>
        {title && <h1 className={styles.title}>{title}</h1>}
        {children}
      </Container>
    </main>
  );
};

export default Main;
