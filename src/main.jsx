import React from "react";
import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import "./index.css";
import Home from "./pages/Home";
import Partenaire from "./pages/Partenaire";
import Morale from "./pages/Morale";
import Physique from "./pages/Physique";
import Client from "./pages/Client";
import Fournisseur from "./pages/Fournisseur";
import Chauffeur from "./pages/Chauffeur";
import Camion from "./pages/Camion";
import Cabine from "./pages/Cabine";
import Remorque from "./pages/Remorque";
import Layout from "./components/layout";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      {/* Home Route */}
      <Route index element={<Home />} />
      <Route path="home" element={<Home />} />

      {/* Partenaire Section */}
      <Route path="partenaire" element={<Partenaire />}>
        <Route path="morale" element={<Morale />}>
          <Route path="client" element={<Client />} />
          <Route path="fournisseur" element={<Fournisseur />} />
        </Route>
        <Route path="physique" element={<Physique />}>
          <Route path="chauffeur" element={<Chauffeur />} />
          <Route path="client" element={<Client />} />
          <Route path="fournisseur" element={<Fournisseur />} />
        </Route>
      </Route>

      {/* Camion Section */}
      <Route path="camion" element={<Camion />}>
        <Route path="cabine" element={<Cabine />} />
        <Route path="remorque" element={<Remorque />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
