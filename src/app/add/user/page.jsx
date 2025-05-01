//src/app/add/user
import Footer from "@/comp/body/footer";
import Page from "@/comp/body/page";
import Linker from "@/comp/body/linker";
import AddUserForm from "@/components/forms/AddUser";

export const metadata = {
  title: "Добавление пользователя | Garden plots",
  description: "Добавление нового пользователя системы (администратор, бухгалтер, инспектор ).",
};

export default function OwnersPage() {
  return (
    <Page>
      <Linker title="Добавить нового пользователя">
        <AddUserForm/>
      </Linker>
      <Footer> admin@i.ua </Footer>
    </Page>
  );
}
