import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";

export default function RootLayout() {
  return (
    <div className="App">
      <div className="header">
        <Header />
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}
