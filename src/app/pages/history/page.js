// app/pages/counters/page.js

import Footer from "@/comp/body/footer";
import Page from "@/comp/body/page";
import Linker from "@/comp/body/linker";
import ReadingsTable from "@/components/tables/ReadingsTable";

// app/pages/history/page.js
export const metadata = {
  title: "История изменений | Garden plots",
  description: "Хронология событий и изменений в системе. Смена владельцев участков, поверка и замена счётчиков  на участках",
};

export default function Counters() {
  return (
    <Page>
      <Linker title="Хронология участков">
        <ReadingsTable/>
      </Linker>
      <Footer> admin@i.ua </Footer>
    </Page>
  );
}
