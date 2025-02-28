import React from "react";
import { Outlet } from "react-router-dom";

export default function Camion() {
  return (
    <div>
      <Outlet />
      <h1>hello</h1>
    </div>
  );
}
