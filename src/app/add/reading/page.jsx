//src/app/add/reading
import Footer from "@/comp/body/footer";
import Page from "@/comp/body/page";
import Linker from "@/comp/body/linker";
import AddReadingsForm from "@/components/forms/AddReadings";

// app/pages/readings/create/page.js
export const metadata = {
  title: "Занести показания | Garden plots",
  description: "Форма для внесения новых показаний электросчетчика.",
};

export default function OwnersPage() {
  return (
    <Page>
      <Linker title="Занесение показаний счётчика">
        <AddReadingsForm/>
      </Linker>
      <Footer> admin@i.ua </Footer>
    </Page>
  );
}
