import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Partenaire from "../pages/partenaire/Partenaire";
import Morale from "../pages/partenaire/Morale";
import Physique from "../pages/partenaire/Physique";
import Client from "../pages/partenaire/Client";
import Fournisseur from "../pages/partenaire/Fournisseur";
import Chauffeur from "../pages/partenaire/Chauffeur";
import Camion from "../pages/camion/Cabine";
import Cabine from "../pages/camion/Cabine";
import Remorque from "../pages/camion/Remorque";
import Layout from "../components/layout";
import Login from "../components/login";
function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/" element={<Layout />}>
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

        <Route path="cabine" element={<Cabine />} />
        <Route path="remorque" element={<Remorque />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
