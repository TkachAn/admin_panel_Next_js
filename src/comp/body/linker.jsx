//src/comp/body/linker.jsx
import styles from "./body.module.css";
import Vheader from "./v-header";
import Header from "./header";
import Main from "./main";

const Linker = ({ children, title }) => {
  
  return (
    <div className={styles.linker}>
      <Vheader/>
      <Header/>
      <Main title={title}>{children}</Main>
    </div>
  );
};

export default Linker;
