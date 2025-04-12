
//src/app/home
import Footer from "@/comp/body/footer";
//import styles from "./page.module.css";
import Main from "@/comp/body/main";
import Page from "@/comp/body/page";
import Header from "@/comp/body/header";
import ChangeOwnerForm from "@/comp/pages/owners/ChOwnerForm";

export const metadata = {
  title: "О проекте | Garden plots",
  description: "Информация о системе учета электроэнергии",
};

export default function Counters() {
  return (
    <Page>
      <Header />
      <Main title="Счётчики">
        <ChangeOwnerForm/>
      </Main>
      <Footer> admin@i.ua </Footer>
    </Page>
  );
}