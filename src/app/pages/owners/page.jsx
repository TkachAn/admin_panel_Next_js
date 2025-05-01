//src/app/owners/
import Footer from "@/comp/body/footer";
import Page from "@/comp/body/page";
import { Owners } from "@/comp/pages/owners/Owners";
import Linker from "@/comp/body/linker";
import { OwnerTable } from "@/components/tables/OwnerTable";

// app/pages/owners/page.js
export const metadata = {
  title: "Владельцы участков | Garden plots",
  description: "Информация о владельцах земельных участков, фамилия инициалы, телефон, адрес электронной почты ",
};

export default function OwnersPage() {
  return (
    <Page>
      <Linker title="Владельцы">
        <OwnerTable/>
      </Linker>
      <Footer> admin@i.ua </Footer>
    </Page>
  );
}
