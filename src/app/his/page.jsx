// app/his/page.js
"use client";
import React from "react";

import PlotsData from "@/comp/pages/plotsData/plotsData";
import Page from "@/comp/body/page";
import Header from "@/comp/body/header";
import Footer from "@/comp/body/footer";
import Main from "@/comp/body/main";
import PlotTable from "@/comp/pages/plot_data/PlotTable";
import Linker from "@/comp/body/linker";

const CountersPage = () => {
  return (
    <Page>
      <Linker title="Посление показания счетчиков">
        <PlotTable />
      </Linker>
      <Footer />
    </Page>
  );
};

export default CountersPage;

// <PlotsData/>
