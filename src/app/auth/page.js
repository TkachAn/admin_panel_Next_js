//"use client";
//src/app/auth/page.j
import React from "react";
import Page from "@/comp/body/page";
import Main from "@/comp/body/main";
import LoginForm from "@/comp/auth/loginForm";

export default function AuthPage() {
  return (
    <Page>
      <Main title="Добро пожаловать!">
      <LoginForm title="Введи свой логин и пороль"/>
      </Main>
    </Page>
  );
}
