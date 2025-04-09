import { LoginPage } from "@/components/pages";

export default function Login() {
  const handleLogin = (email, password) => {
    console.log("Вошли с:", email, password);
    // todo: добавить настоящую проверку
  };

  return <LoginPage onLogin={handleLogin} />;
}
