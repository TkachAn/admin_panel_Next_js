// app/his/page.js
"use client";
import React from "react";

import PlotsData from "@/comp/pages/plotsData/plotsData";
import Page from "@/comp/body/page";
import Header from "@/comp/body/header";
import Footer from "@/comp/body/footer";
import Main from "@/comp/body/main";
import PlotTable from "@/comp/pages/plot_data/PlotTable";

const CountersPage = () => {
  return (
    <Page>
      <Header />
      <Main title="Посление показания счетчиков">
        <PlotTable />
      </Main>
      <Footer />
    </Page>
  );
};

export default CountersPage;

// <PlotsData/>
