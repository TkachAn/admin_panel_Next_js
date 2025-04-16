//src/app/page.jx
"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Page from "@/comp/body/page";
import Main from "@/comp/body/main";
import Footer from "@/comp/body/footer";
import Home from "@/comp/pages/home";
import Linker from "@/comp/body/linker";

export default function MainPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Если статус загрузки, ничего не делаем
    if (status === "loading") {
      return;
    }

    // Если пользователь не авторизован, перенаправляем на страницу входа
    if (status === "unauthenticated") {
      router.push("/auth");
    }
    // Если пользователь авторизован, ничего не делаем, рендерится HomePage
  }, [session, status, router]);

  // Пока идет загрузка сессии, показываем сообщение
  if (status === "loading") {
    return (
      <Page>
        <Main>
          <p>Проверка авторизации...</p>
        </Main>
      </Page>
    );
  }

  // Если пользователь авторизован, рендерим HomePage
  if (status === "authenticated") {
    return (
      <Page>
        <Linker title="Главная">
          <Home />
        </Linker>
        <Footer>admin@i.ua</Footer>
      </Page>
    );
  }

  // Если пользователь не авторизован (идет редирект), ничего не рендерим
  return null;
}
