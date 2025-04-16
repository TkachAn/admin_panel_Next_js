//src/comp/body/container.jsx

import styles from './body.module.css'; // Создайте файл Main.module.css

export default function Container({ children}) {
  return (
    <div className={styles.container}>
      {children}
    </div>
  );
}
