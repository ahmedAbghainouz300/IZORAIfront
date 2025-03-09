import React from "react";
import { Outlet } from "react-router-dom";
import Nav from "./Nav";
import "../styles/layout.css";

export default function Layout() {
  return (
    <div className="layout-container">
      <Nav />
      <div className="content-container">
        <Outlet />
      </div>
    </div>
  );
}