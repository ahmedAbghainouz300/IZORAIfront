import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import { BsTruckFlatbed } from "react-icons/bs";
import { createTheme } from "@mui/material/styles";
import DescriptionIcon from "@mui/icons-material/Description";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import HomeIcon from "@mui/icons-material/Home";
import { GoContainer } from "react-icons/go";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { useDemoRouter } from "@toolpad/core/internal";
import Home from "../pages/Home";
import Partenaire from "../pages/partenaire/Partenaire";
import Morale from "../pages/partenaire/Morale";
import Physique from "../pages/partenaire/Physique";
import Client from "../pages/partenaire/Client";
import Fournisseur from "../pages//partenaire/Fournisseur";
import Chauffeur from "../pages/Partenaire/Chauffeur";
import Camion from "../pages/Camion/Camion";
import Cabine from "../pages/camion/Cabine";
import Remorque from "../pages/camion/Remorque";

const theme = createTheme({
  palette: {
    primary: {
      main: "#fff", // Change this to your desired primary color
    },
  },
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

const NAVIGATION = [
  {
    kind: "header",
    title: "Main items",
  },
  {
    segment: "home",
    title: "Home",
    icon: <HomeIcon />,
    pattern: "/home",
    kind: "page",
  },
  {
    segment: "partenaire",
    title: "Partenaire",
    icon: <Diversity3Icon />,
    pattern: "/partenaire",
    kind: "page",
    children: [
      {
        segment: "morale",
        title: "Morale",
        icon: <PeopleIcon />,
        pattern: "/partenaire/morale",
        kind: "page",
        children: [
          {
            segment: "client",
            title: "Client",
            icon: <PersonIcon />,
            pattern: "/partenaire/physique/client",
            kind: "page",
          },
          {
            segment: "fournisseur",
            title: "Fournisseur",
            icon: <PersonIcon />,
            pattern: "/partenaire/physique/fournisseur",
            kind: "page",
          },
        ],
      },
      {
        segment: "physique",
        title: "Physique",
        icon: <PeopleIcon />,
        pattern: "/partenaire/physique",
        kind: "page",
        children: [
          {
            segment: "chauffeur",
            title: "Chauffeur",
            icon: <PersonIcon />,
            pattern: "/partenaire/physique/chauffeur",
            kind: "page",
          },
          {
            segment: "client",
            title: "Client",
            icon: <PersonIcon />,
            pattern: "/partenaire/physique/client",
            kind: "page",
          },
          {
            segment: "fournisseur",
            title: "Fournisseur",
            icon: <PersonIcon />,
            pattern: "/partenaire/physique/fournisseur",
            kind: "page",
          },
        ],
      },
    ],
  },
  {
    segment: "camion",
    title: "Camion",
    icon: <LocalShippingIcon />,
    pattern: "/camion",
    kind: "page",
    children: [
      {
        segment: "cabine",
        title: "Cabine",
        icon: <BsTruckFlatbed />,
        pattern: "/camion/cabine",
        kind: "page",
      },
      {
        segment: "remorque",
        title: "Remorque",
        icon: <GoContainer />,
        pattern: "/camion/remorque",
        kind: "page",
      },
    ],
  },
];

function DemoPageContent({ pathname }) {
  const renderPage = () => {
    console.log("pathname : " + pathname);
    switch (pathname) {
      case "/home":
        return <Home />;
      case "/partenaire":
        return <Partenaire />;
      case "/partenaire/morale":
        return <Morale />;
      case "/partenaire/morale/client":
        return <Client />;
      case "/partenaire/morale/fournisseur":
        return <Fournisseur />;
      case "/partenaire/physique":
        return <Physique />;
      case "/partenaire/physique/chauffeur":
        return <Chauffeur />;
      case "/partenaire/physique/client":
        return <Client />;
      case "/partenaire/physique/fournisseur":
        return <Fournisseur />;
      case "/camion":
        return <Camion />;
      case "/camion/cabine":
        return <Cabine />;
      case "/camion/remorque":
        return <Remorque />;
      default:
        return <Home />;
    }
  };
  return (
    <Box
      sx={{
        py: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      {renderPage()}
    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function Layout(props) {
  const { window } = props;
  const router = useDemoRouter(""); // hna 7ydt /home kant katdina par defaut l home mor makanbrko 3la partenaire
  const demoWindow = window !== undefined ? window() : undefined;

  return (
    <AppProvider
      navigation={NAVIGATION.map((item) => ({
        ...item,
        onClick: () => handleNavigation(item.pattern), // Add onClick handler
      }))}
      branding={{
        logo: <img src="src/assets/0.png" alt="MUI logo" />,
        title: "IZORAI",
        color: "primary",
        homeUrl: "/toolpad/core/introduction",
        sidebarExpandedWidth: "250px",
      }}
      router={router}
      theme={theme}
      window={demoWindow}
    >
      <DashboardLayout sidebarExpandedWidth="250px">
        <DemoPageContent pathname={router.pathname} />
      </DashboardLayout>
    </AppProvider>
  );
}

Layout.propTypes = {
  window: PropTypes.func,
};

export default Layout;
