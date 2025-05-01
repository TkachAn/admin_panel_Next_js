import { LoginPage } from "@/components/pages";
// app/pages/history/page.js
export const metadata = {
  title: "Вход в систему | Garden plots",
  description: "Вход в систему для пользователей, администраторы сайта бухгалтеры и инспекторы",
};
export default function Login() {
  const handleLogin = (email, password) => {
    console.log("Вошли с:", email, password);
    // todo: добавить настоящую проверку
  };

  return <LoginPage onLogin={handleLogin} />;
}
