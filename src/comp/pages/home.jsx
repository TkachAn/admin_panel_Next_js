import { useState } from "react";
import AddUser from "../admin/modal/winsdow"; // твоя модалка

export default function Home() {
  const [isOpen, setIsOpen] = useState(false); // ← вот этого не хватало
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    note: "",
    pass: ""
  });

  function handleSubmit(e) {
    e.preventDefault();
    console.log("Отправка данных", formData);
    setIsOpen(false); // закрыть модалку после отправки
  }

  return (
    <>
      <div>
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