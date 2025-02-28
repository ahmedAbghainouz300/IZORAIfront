import { Routes, Route } from "react-router-dom";
import Layout from "../components/Layout"; // Un layout avec <Outlet />
import Home from "../pages/Home";
import Partenaire from "../pages/partenaire/Partenaire";
import Morale from "../pages/partenaire/Morale";
import Physique from "../pages/partenaire/Physique";
import Client from "../pages/partenaire/Client";
import Fournisseur from "../pages/partenaire/Fournisseur";
import Chauffeur from "../pages/partenaire/Chauffeur";
import Camion from "../pages/camion/Camion";
import Cabine from "../pages/camion/Cabine";
import Remorque from "../pages/camion/Remorque";
import allRoutes from "./AllRoutes";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path={allRoutes.home} element={<Home />} />
        
        {/* Partenaire Section */}
        <Route path={allRoutes.partenaire.base} element={<Partenaire />}>
          <Route path={allRoutes.partenaire.morale.base} element={<Morale />}>
            <Route path={allRoutes.partenaire.morale.client} element={<Client />} />
            <Route path={allRoutes.partenaire.morale.fournisseur} element={<Fournisseur />} />
          </Route>
          <Route path={allRoutes.partenaire.physique.base} element={<Physique />}>
            <Route path={allRoutes.partenaire.physique.chauffeur} element={<Chauffeur />} />
            <Route path={allRoutes.partenaire.physique.client} element={<Client />} />
            <Route path={allRoutes.partenaire.physique.fournisseur} element={<Fournisseur />} />
          </Route>
        </Route>

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
