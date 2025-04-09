//src/app/admin
import Footer from "@/comp/body/footer";
//import styles from "./page.module.css";
import Main from "@/comp/body/main";
import Page from "@/comp/body/page";
import Header from "@/comp/body/header";
import AdminAddUserPanel from "@/comp/admin/panel";

export const metadata = {
  title: "Панель администратора | Garden plots",
  description: "Управление пользователями и данными",
};

export default function AdminPanel() {
  return (
    <Page>
      <Header />
      <Main title="Панель администратора">
        <AdminAddUserPanel />
      </Main>
      <Footer> admin@i.ua </Footer>
    </Page>
  );
}
