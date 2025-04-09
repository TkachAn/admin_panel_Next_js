//src/app/page.jx
"use client";
import { useSession } from 'next-auth/react';
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Page from "@/comp/body/page";
import Main from "@/comp/body/main";

import Header from "@/comp/body/header";
import Footer from "@/comp/body/footer";
import Home from "@/comp/pages/home";

export default function MainPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Если статус загрузки, ничего не делаем
    if (status === 'loading') {
      return;
    }

    // Если пользователь не авторизован, перенаправляем на страницу входа
    if (status === 'unauthenticated') {
      router.push('/auth');
    }
    // Если пользователь авторизован, ничего не делаем, рендерится HomePage
  }, [session, status, router]);

  // Пока идет загрузка сессии, показываем сообщение
  if (status === 'loading') {
    return (
      <Page>
        <Main>
          <p>Проверка авторизации...</p>
        </Main>
      </Page>
    );
  }

  // Если пользователь авторизован, рендерим HomePage
  if (status === 'authenticated') {
    return (
      <Page>
        <Header />
        <Main title="Главная">
          <Home />
        </Main>
        <Footer>admin@i.ua</Footer>
      </Page>
    );
  }

  // Если пользователь не авторизован (идет редирект), ничего не рендерим
  return null;
}


/*
export default function MainPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/auth"); // ✅ Автоматически отправляет на страницу входа
  }, []);

  return (
    <Page>
      <Main>
        <p>Перенаправление...</p>;
      </Main>
    </Page>
  );
}
*/
/*
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import Page from '@/components/Page'; // Предполагаю, что у вас есть такие компоненты
import Main from '@/components/Main';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HomePage from '@/components/HomePage';

export default function MainPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Если статус загрузки, ничего не делаем
    if (status === 'loading') {
      return;
    }

    // Если пользователь не авторизован, перенаправляем на страницу входа
    if (status === 'unauthenticated') {
      router.push('/auth');
    }
    // Если пользователь авторизован, ничего не делаем, рендерится HomePage
  }, [session, status, router]);

  // Пока идет загрузка сессии, показываем сообщение
  if (status === 'loading') {
    return (
      <Page>
        <Main>
          <p>Проверка авторизации...</p>
        </Main>
      </Page>
    );
  }

  // Если пользователь авторизован, рендерим HomePage
  if (status === 'authenticated') {
    return (
      <Page>
        <Header />
        <Main title="Главная">
          <HomePage />
        </Main>
        <Footer>admin@i.ua</Footer>
      </Page>
    );
  }

  // Если пользователь не авторизован (идет редирект), ничего не рендерим
  return null;
}

*/