import react, { useState } from "react";
import AddUser from "../admin/modal/winsdow"; // твоя модалка
//import { CloseButton } from "@/elem/closeButton";
import LogoutButton from "@/elem/logoutButton";
//import { CloseButton, EditButton, AddButton, DeleteButton, Plus1 } from "@/elem/Buttuns";
import {
  SubmitButton,
  DeleteButton,
  AddButton,
  EditButton,
} from "@/elem/buttons/buttons";
import {
  CloseIconButton,
  DeleteIconButton,
  EditIconButton,
  AddIconButton,
  UserAddIconButton,
  UserEditIconButton,
} from "@/elem/buttons/IconButtons";

export default function Home() {
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

  return (
    <>
      <div>
        <div>
       
          {/*<CloseButton>CloseButton</CloseButton>*/}
        </div>
        <div>
          <h3>LogoutButton</h3>
          <LogoutButton>LogoutButton</LogoutButton>
        </div>
        <div>
          <h3>NormButton</h3>
          {/*<NormButton>NormButton</NormButton>*/}
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
          <AddButton />
          <DeleteButton />
        </div>
        <button onClick={() => setIsOpen(true)}>Открыть модалку</button>
        <AddUser
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSubmit={handleSubmit}
          formData={formData}
          setFormData={setFormData}
        />
      </div>
    </>
  );
}

/*
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
*/
