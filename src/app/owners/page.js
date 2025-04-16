//src/app/owners/
import Footer from "@/comp/body/footer";
import Page from "@/comp/body/page";
import { Owners } from "@/comp/pages/owners/Owners";
import Linker from "@/comp/body/linker";

export const metadata = {
  title: "О проекте | Garden plots",
  description: "Информация о системе учета электроэнергии",
};

export default function OwnersPage() {
  return (
    <Page>
      <Linker title="Владельцы">
        <Owners />
      </Linker>
      <Footer> admin@i.ua </Footer>
    </Page>
  );
}
