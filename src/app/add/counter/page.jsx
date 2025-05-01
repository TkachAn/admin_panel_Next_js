//src/app/add/counter
import Footer from "@/comp/body/footer";
import Page from "@/comp/body/page";
import Linker from "@/comp/body/linker";
import AddCounterForm from "@/components/forms/AddCounter";

// app/pages/meters/create/page.js
export const metadata = {
  title: "Добавить счетчик | Garden plots",
  description: "Форма для регистрации нового электросчетчика.",
};

export default function OwnersPage() {
  return (
    <Page>
      <Linker title="Замена счётчика на участке ">
        <AddCounterForm/>
      </Linker>
      <Footer> admin@i.ua </Footer>
    </Page>
  );
}
