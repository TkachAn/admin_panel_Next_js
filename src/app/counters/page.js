//src/app/home
import Footer from "@/comp/body/footer";
import Page from "@/comp/body/page";
import Linker from "@/comp/body/linker";
import CountersTable from "@/components/tables/CounterTable";


// app/pages/meters/page.js
export const metadata = {
  title: "Учет счетчиков | Garden plots",
  description: "Перечень зарегистрированных электросчетчиков, Информация о привязке счётчика к земельному участку а также серийный номер, модель, тип, место размещения [дом, двор], наличие пломб, Редактирование изменений.",
};

export default function Counters() {
  return (
    <Page>
      <Linker title="Счётчики">
      
      <CountersTable/>
      </Linker>
      <Footer> admin@i.ua </Footer>
    </Page>
  );
}

//<AddCounterForm/>