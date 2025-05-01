//src/app/pages/plots
import Footer from "@/comp/body/footer";
import Page from "@/comp/body/page";
import Linker from "@/comp/body/linker";
import AddPlotForm from "@/components/forms/AddPlot";

export const metadata = {
  title: "О проекте | Garden plots",
  description: "Информация о системе учета электроэнергии",
};

export default function OwnersPage() {
  return (
    <Page>
      <Linker title="Добавить новый участок">
        <AddPlotForm/>
      </Linker>
      <Footer> admin@i.ua </Footer>
    </Page>
  );
}
