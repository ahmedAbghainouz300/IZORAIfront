import * as React from 'react';
import { createTheme } from '@mui/material/styles';
import { AppProvider } from '@toolpad/core';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { Outlet } from 'react-router-dom';
import FolderIcon from '@mui/icons-material/Folder';
import DescriptionIcon from '@mui/icons-material/Description';

// Theme Setup
const demoTheme = createTheme({
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

// Navigation Items
const NAVIGATION = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: 'home',
    title: 'Home',
    icon: <FolderIcon />,
    path: '/',
  },
  {
    segment: 'partenaire',
    title: 'Partenaire',
    icon: <FolderIcon />,
    path: '/partenaire',
    children: [
      {
        segment: 'morale',
        title: 'Morale',
        icon: <DescriptionIcon />,
        path: '/partenaire/morale',
        children: [
          { segment: 'client', title: 'Client', icon: <DescriptionIcon />, path: '/partenaire/morale/client' },
          { segment: 'fournisseur', title: 'Fournisseur', icon: <DescriptionIcon />, path: '/partenaire/morale/fournisseur' },
        ],
      },
      {
        segment: 'physique',
        title: 'Physique',
        icon: <DescriptionIcon />,
        path: '/partenaire/physique',
        children: [
          { segment: 'chauffeur', title: 'Chauffeur', icon: <DescriptionIcon />, path: '/partenaire/physique/chauffeur' },
          { segment: 'client', title: 'Client', icon: <DescriptionIcon />, path: '/partenaire/physique/client' },
          { segment: 'fournisseur', title: 'Fournisseur', icon: <DescriptionIcon />, path: '/partenaire/physique/fournisseur' },
        ],
      },
    ],
  },
  {
    segment: 'camion',
    title: 'Camion',
    icon: <FolderIcon />,
    path: '/camion',
    children: [
      { segment: 'cabine', title: 'Cabine', icon: <DescriptionIcon />, path: '/camion/cabine' },
      { segment: 'remorque', title: 'Remorque', icon: <DescriptionIcon />, path: '/camion/remorque' },
    ],
  },
];

function Layout() {
  return (
    <AppProvider navigation={NAVIGATION} theme={demoTheme} window={window}>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </AppProvider>
  );
}

export default Layout;
