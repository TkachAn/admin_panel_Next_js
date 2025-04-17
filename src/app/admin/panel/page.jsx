import Page from "@/comp/body/page";
import AdminAddUserPanel from "@/comp/admin/panel";
import Linker from "@/comp/body/linker";

export const metadata = {
  title: "Панель администратора | Garden plots",
  description: "Управление пользователями и данными",
};

export default function AdminPanel() {
  return (
    <Page>
      <Linker title="Панель администратора">
        <AdminAddUserPanel />
      </Linker>
      <Footer> admin@i.ua </Footer>
    </Page>
  );
}
