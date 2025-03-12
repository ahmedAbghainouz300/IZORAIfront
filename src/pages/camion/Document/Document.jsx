import React from "react";
import { Outlet } from "react-router-dom";

export default function Document() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
