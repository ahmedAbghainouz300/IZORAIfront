import React, { useState } from "react";
import { Link } from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import "../styles/nav.css";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import { BsTruckFlatbed } from "react-icons/bs";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import { GoContainer } from "react-icons/go";
import HomeIcon from "@mui/icons-material/Home";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AllRoutes from "../routes/AllRoutes";
import TypePartenaire from './../pages/partenaire/typePartenaire';
import Morale from './../pages/partenaire/Morale';

const Nav = () => {
  const [openSections, setOpenSections] = useState({
    partenaire: false,
    morale: false,
    physique: false,
    camion: false,
  });

  const [activeSection, setActiveSection] = useState(null);

  const toggleSection = (section) => {
    console.log("Toggling section:", section); // Debugging
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));

    setActiveSection((prev) => (prev === section ? null : section));
  };

  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <h2>IZORAI</h2>
      </div>
      <ul className="nav-list">
        <li className="nav-item">
          <Link to="/home">
            <HomeIcon />
            <span>Home</span>
          </Link>
        </li>
        <li>
          <div
            className={`nav-toggle ${activeSection === "partenaire" ? "active" : ""}`}
            onClick={() => toggleSection("partenaire")}
          >
            <PeopleIcon />
            <span>Partenaire</span>
            {openSections.partenaire ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </div>
          {openSections.partenaire && (
            <ul>
              
              <li className="nav-item">
                <Link to={AllRoutes.partenaire.morale.base}>
                  <PersonIcon />
                  <span>Morale</span>
                </Link>
              </li>
              
              <li className="nav-item">
                  <Link to={AllRoutes.partenaire.physique.base}>
                     <PersonIcon />
                      <span>Physique</span>
                  </Link>
              </li>
              <li className="nav-item">
                      <Link to={AllRoutes.partenaire.typePartenaire.base}>
                        <PersonIcon />
                        <span>TypePartenaire</span>
                      </Link>
              </li>
              <li className="nav-item">
                  <Link to={AllRoutes.partenaire.chauffeur}>
                    <PersonIcon />
                    <span>Chauffeur</span>
                  </Link>
              </li>
            </ul>
          )}
        </li>
        <li>
          <div
            className={`nav-toggle ${activeSection === "camion" ? "active" : ""}`}
            onClick={() => toggleSection("camion")}
          >
            <LocalShippingIcon />
            <span>Camion</span>
            {openSections.camion ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </div>
          {openSections.camion && (
            <ul>
              <li className="nav-item">
                <Link to="/cabine">
                  <BsTruckFlatbed />
                  <span>Cabine</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/remorque">
                  <GoContainer />
                  <span>Remorque</span>
                </Link>
              </li>
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
