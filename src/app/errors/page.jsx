//src/app/errors
import Footer from "@/comp/body/footer";
import Page from "@/comp/body/page";
import Linker from "@/comp/body/linker";
import ErrorInfo from "@/components/errors/Errors";

export const metadata = {
  title: "О проекте | Garden plots",
  description: "Информация о системе учета электроэнергии",
};

export default function Counters() {
  return (
    <Page>
      <Linker title="Ошибки">
      
      <ErrorInfo/>
      </Linker>
      <Footer> admin@i.ua </Footer>
    </Page>
  );
}
//<ErrorModal/>