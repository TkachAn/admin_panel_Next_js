//src/app/add/owner
import Footer from "@/comp/body/footer";
import Page from "@/comp/body/page";
import Linker from "@/comp/body/linker";
import AddOwnerForm from "@/components/forms/AddOwner";

// app/pages/owners/create/page.js
export const metadata = {
  title: "Добавить владельца | Garden plots",
  description: "Форма для регистрации нового владельца участка.",
};

export default function OwnersPage() {
  return (
    <Page>
      <Linker title="Смена владельца участка ">
        <AddOwnerForm/>
      </Linker>
      <Footer> admin@i.ua </Footer>
    </Page>
  );
}
