
//src/app/owners/
import Footer from "@/comp/body/footer";
import Main from "@/comp/body/main";
import Page from "@/comp/body/page";
import Header from "@/comp/body/header";
import { Owners } from "@/comp/pages/owners/Owners";

export const metadata = {
  title: "О проекте | Garden plots",
  description: "Информация о системе учета электроэнергии",
};

export default function OwnersPage() {
  return (
    <Page>
      <Header />
      <Main title="Владельцы">
        <Owners/>
      </Main>
      <Footer> admin@i.ua </Footer>
    </Page>
  );
}
