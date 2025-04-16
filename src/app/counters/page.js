
//src/app/home
import Footer from "@/comp/body/footer";
//import styles from "./page.module.css";
import Main from "@/comp/body/main";
import Page from "@/comp/body/page";
import Header from "@/comp/body/header";
import ChangeOwnerForm from "@/comp/pages/owners/ChOwnerForm";
import Linker from "@/comp/body/linker";

export const metadata = {
  title: "О проекте | Garden plots",
  description: "Информация о системе учета электроэнергии",
};

export default function Counters() {
  return (
    <Page>
      <Linker title="Счётчики">
      
        <ChangeOwnerForm/>
      </Linker>
      <Footer> admin@i.ua </Footer>
    </Page>
  );
}