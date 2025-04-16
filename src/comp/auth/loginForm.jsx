//src/comp/auth/LoginForm.jsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import styles from "./form.module.css";
import { EmailInput, PassInput } from "@/elem/inputs";
import { SubmitButton } from "@/elem/buttons/buttons";

export const metadata = {
  title: "Авторизация | Garden plots",
  description: "Вход в систему учёта электроэнергии",
};

export default function AuthPage({ title = "Вход" }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const isValid = email.trim() && pass.trim();

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      redirect: false,
      email,
      pass,
      callbackUrl: "/",
    });

    if (res.ok) {
      router.push("/");
    } else {
      alert("Ошибка входа");
    }
  };

  return (
    <form onSubmit={handleLogin} className={styles.loginForm}>
      {title && <h2 className={styles.title}>{title}</h2>}
      <EmailInput value={email} onChange={(e) => setEmail(e.target.value)} />

      <PassInput value={pass} onChange={(e) => setPass(e.target.value)} />
      {error && <p className={styles.error}>{error}</p>}
      <SubmitButton
        children="ВОЙТИ"
        status={email && pass ? "accent" : "blocked"}
      />
    </form>
  );
}
