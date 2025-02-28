import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import DescriptionIcon from '@mui/icons-material/Description';
import FolderIcon from '@mui/icons-material/Folder';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useDemoRouter } from '@toolpad/core/internal';
import Home from "../pages/Home";
import Partenaire from "../pages/Partenaire";
import Morale from "../pages/Morale";
import Physique from "../pages/Physique";
import Client from "../pages/Client";
import Fournisseur from "../pages/Fournisseur";
import Chauffeur from "../pages/Chauffeur";
import Camion from "../pages/Camion";
import Cabine from "../pages/Cabine";
import Remorque from "../pages/Remorque";

const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
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
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: 'home',
    title: 'Home',
    icon: <FolderIcon />,
    pattern: '/home',
    kind: 'page',
  },
  {
    segment: 'partenaire',
    title: 'Partenaire',
    icon: <FolderIcon />,
    pattern: '/partenaire',
    kind: 'page',
    children: [
      {
        segment: 'morale',
        title: 'Morale',
        icon: <DescriptionIcon />,
        pattern: '/partenaire/morale',
        kind: 'page',
        children: [
          {
            segment: 'client',
            title: 'Client',
            icon: <DescriptionIcon />,
            pattern: '/partenaire/physique/client',
            kind: 'page',
          },
          {
            segment: 'fournisseur',
            title: 'Fournisseur',
            icon: <DescriptionIcon />,
            pattern: '/partenaire/physique/fournisseur',
            kind: 'page',
          },
        ],
      },
      {
        segment: 'physique',
        title: 'Physique',
        icon: <DescriptionIcon />,
        pattern: '/partenaire/physique',
        kind: 'page',
        children: [
          {
            segment: 'chauffeur',
            title: 'Chauffeur',
            icon: <DescriptionIcon />,
            pattern: '/partenaire/physique/chauffeur',
            kind: 'page',
          },
          {
            segment: 'client',
            title: 'Client',
            icon: <DescriptionIcon />,
            pattern: '/partenaire/physique/client',
            kind: 'page',
          },
          {
            segment: 'fournisseur',
            title: 'Fournisseur',
            icon: <DescriptionIcon />,
            pattern: '/partenaire/physique/fournisseur',
            kind: 'page',
          },
        ],
      },
    ],
  },
  {
    segment: 'camion',
    title: 'Camion',
    icon: <FolderIcon />,
    pattern: '/camion',
    kind: 'page',
    children: [
      {
        segment: 'cabine',
        title: 'Cabine',
        icon: <DescriptionIcon />,
        pattern: '/camion/cabine',
        kind: 'page',
      },
      {
        segment: 'remorque',
        title: 'Remorque',
        icon: <DescriptionIcon />,
        pattern: '/camion/remorque',
        kind: 'page',
      },
    ],
  },
];

function DemoPageContent({ pathname }) {
  const renderPage = () => {
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
      
    }
  };
  return (
    <Box
      sx={{
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
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
  const router = useDemoRouter('/home');
  const demoWindow = window !== undefined ? window() : undefined;

  return (
    <AppProvider navigation={NAVIGATION.map((item) => ({
      ...item,
      onClick: () => handleNavigation(item.pattern), // Add onClick handler
    }))} router={router} theme={theme} window={demoWindow}>
      <DashboardLayout>
        <DemoPageContent pathname={router.pathname} />
      </DashboardLayout>
    </AppProvider>
  );
}

Layout.propTypes = {
  window: PropTypes.func,
};

export default Layout;