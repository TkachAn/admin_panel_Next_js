//src/comp/pages/home.jsx
import GardenReadingsTable from "./lastReadings/table";

export default function Home() {

  return (
    <>
       <GardenReadingsTable/>
    </>
  );
}

/*
import react, { useState } from "react";
import AddUser from "../admin/modal/winsdow"; // твоя модалка
//import { CloseButton } from "@/elem/closeButton";
//import LogoutButton from "@/elem/buttons/logoutButton";
//import { CloseButton, EditButton, AddButton, DeleteButton, Plus1 } from "@/elem/Buttuns";
import {
  SubmitButton,
  DeleteButton,
  AddButton,
  EditButton,
  NormButton,
  LogoutButton,
} from "@/elem/buttons/buttons";
import { LogOutIconButton } from "@/elem/buttons/IconButtons";
import {
  CloseIconButton,
  DeleteIconButton,
  EditIconButton,
  AddIconButton,
  UserAddIconButton,
  UserEditIconButton,
} from "@/elem/buttons/IconButtons";
import { LogoPic } from "../logo/logoPic";
import Vnavbar from "../navbar/v-navbar";
import Vheader from "../body/v-header";


  const [isOpen, setIsOpen] = useState(false); // ← вот этого не хватало
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    note: "",
    pass: "",
  });

  function handleSubmit(e) {
    e.preventDefault();
    console.log("Отправка данных", formData);
    setIsOpen(false); // закрыть модалку после отправки
  }



      <p>
        Что такое Lorem Ipsum? Lorem Ipsum - это текст-"рыба", часто
        используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной
        "рыбой" для текстов на латинице с начала XVI века. В то время некий
        безымянный печатник создал большую коллекцию размеров и форм шрифтов,
        используя Lorem Ipsum для распечатки образцов. Lorem Ipsum не только
        успешно пережил без заметных изменений пять веков, но и перешагнул в
        электронный дизайн. Его популяризации в новое время послужили публикация
        листов Letraset с образцами Lorem Ipsum в 60-х годах и, в более недавнее
        время, программы электронной вёрстки типа Aldus PageMaker, в шаблонах
        которых используется Lorem Ipsum.
      </p>

       <div>
          <LogOutIconButton/>
         
          </div>
          <div>
            <h3>LogoutButton</h3>
            <LogoutButton/>
          </div>
          <div>
            <h3>NormButton</h3>
            <NormButton children="children"/>
          </div>
          <div>
            <CloseIconButton />
            <EditIconButton />
            <AddIconButton />
            <DeleteIconButton />
            <UserAddIconButton />
            <UserEditIconButton />
          </div>
          <div>
            <SubmitButton />
            <EditButton />
            <AddButton status="blocked" />
            <DeleteButton status="accent" />
          </div>
          <NormButton onClick={() => setIsOpen(true)} children="Открыть модалку"/>
          <AddUser
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            onSubmit={handleSubmit}
            formData={formData}
            setFormData={setFormData}
          />

*/
