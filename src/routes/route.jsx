import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";
import Home from "../pages/Home";
import Partenaire from "../pages/partenaire/Partenaire";
import Morale from "../pages/partenaire/Morale";
import Physique from "../pages/partenaire/Physique";
import Chauffeur from "../pages/partenaire/Chauffeur";
import Camion from "../pages/camion/Camion";
import Cabine from "../pages/camion/Cabine";
import Remorque from "../pages/camion/Remorque";
import Login from "../components/login";
import allRoutes from "./AllRoutes";
import TypePartenaire from "../pages/partenaire/typePartenaire";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path={allRoutes.home} element={<Home />} />

        {/* Partenaire Section */}
        <Route path={allRoutes.partenaire.base} element={<Partenaire />}>
          <Route
            path={allRoutes.partenaire.morale.base}
            element={<Morale />}
          ></Route>
          <Route
            path={allRoutes.partenaire.physique.base}
            element={<Physique />}
          ></Route>
          <Route
            path={allRoutes.partenaire.typePartenaire.base}
            element={<TypePartenaire />}
          />
        </Route>
        <Route path="/partenaire/chauffeur" element={<Chauffeur />} />

        {/* Camion Section */}
        <Route path={allRoutes.camion.base} element={<Camion />}>
          <Route path={allRoutes.camion.cabine} element={<Cabine />} />
          <Route path={allRoutes.camion.remorque} element={<Remorque />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRoutes;
